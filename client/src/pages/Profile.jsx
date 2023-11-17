import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {app} from "../firebase.js";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {
  updateUserSuccess,
  updateUserFailure,
  updateUserStart,
  deleteUserSuccess,
  deleteUserFailure, deleteUserStart, signOutUserStart, signOutUserFailure
} from "../redux/user/userSlice.js";
import {Link} from "react-router-dom";

export default function Profile() {
  const {currentUser, loading, error} = useSelector(state => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingError, setShowListingError] = useState(false)
  const [userListings, setUserListings] = useState([])
  const dispatch = useDispatch()

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)


    uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
        setFilePerc(Math.round(progress))
      },
      (error) => {
        console.log(error)
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({...formData, avatar: downloadURL})
        )
      })

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleOnChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      console.log(data)
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess())
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout')
      const data = res.json()
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }

  const handleShowListings = async () => {
    try {
      const res = await fetch(`/api/user/listing/${currentUser._id}`)
      const data = await res.json()
      if (data.success === false) {
        setShowListingError(true)
        return
      }
      setUserListings(data)
    } catch (error) {
      setShowListingError(true)
    }
  }


  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  return (
    <div className={'p-3 max-w-lg mx-auto'}>
      <h1 className={'text-3xl font-semibold text-center my-7'}>Profile</h1>
      <form onSubmit={handleSubmit} action="" className={'flex flex-col gap-4'}>
        <input onChange={(event) => setFile(event.target.files[0])}
               type="file" ref={fileRef} hidden accept={'image/.*'}/>
        <img onClick={() => fileRef.current.click()}
             src={formData.avatar || currentUser.avatar}
             alt="profile"
             className={'rounded-full h-24 w-24 object-cover cursor-pointer self-center'}
        />
        <p className={'text-sm self-center'}>
          {fileUploadError ? (
            <span className={'text-red-700'}>Error Image upload (image must be less than 2Mb)</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span>
              {`Uploading ${filePerc}%`}
            </span>
          ) : filePerc === 100 ? (
            <span className={'text-green-700'}>
              Image successfully uploaded!
            </span>
          ) : (
            ""
          )
          }
        </p>
        <input type="text" placeholder={'username'}
               defaultValue={currentUser.username}
               onChange={handleOnChange}
               className={'border p-3 rounded-lg'} id={'username'}
        />
        <input type="email" placeholder={'email'}
               defaultValue={currentUser.email}
               className={'border p-3 rounded-lg'} id={'email'}
               onChange={handleOnChange}
        />
        <input type="password" placeholder={'password'}
               onChange={handleOnChange}
               className={'border p-3 rounded-lg'} id={'password'}
        />
        <button disabled={loading} className={`bg-slate-700 text-white rounded-lg p-3 
          uppercase hover:opacity-95 disabled:opacity-80`}>
          {loading ? 'Loading...' : 'update'}
        </button>
        <Link to={"/create-listing"} className={`bg-green-700 text-white p-3 rounded-lg 
          uppercase text-center hover:opacity-95`}>
          Create Listing
        </Link>
      </form>
      <div className={"flex justify-between mt-5"}>
        <span onClick={handleDeleteUser} className={"text-red-700 cursor-pointer"}>Delete Account</span>
        <span onClick={handleSignOut} className={"text-red-700 cursor-pointer"}>Sign out</span>
      </div>
      <p className={'text-red-700 mt-5'}>{error ? error : ''}</p>
      <p className={'text-green-700 mt-5'}>{updateSuccess ? 'User is updated successfully' : ''}</p>

      <button onClick={handleShowListings} className={'text-green-700 w-full '}>Show Listings</button>
      <p className={'text-red-700 mt-5'}>{showListingError ? 'Error showing listings: ' : ''}</p>
      {userListings && userListings.length > 0 &&
        <div className={'flex flex-col gap-4'}>
          <h1 className={'text-center mt-7 text-2xl font-semibold'}>Your listings</h1>
          {userListings.map((listing) => (
            <div className={'border rounded-lg flex justify-between items-center gap-4'}
                 key={listing._id}>
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt={'Listing cover'}
                     className={'h-16 w-16 object-contain'}
                />
              </Link>
              <Link className={'text-slate-700 font-semibold hover:underline truncate'}
                    to={`/listing/${listing._id}`}>
                <p className={''}>
                  {listing.name}
                </p>
              </Link>
              <div className={'flex flex-col items-center'}>
                <button className={'text-red-700 uppercase'}>Delete</button>
                <button className={'text-green-700 uppercase'}>Edit</button>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  )
}