import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper'
import {Navigation} from "swiper/modules";
import 'swiper/css/bundle'

function Listing(props) {
  SwiperCore.use([Navigation])
  const params = useParams()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/listing/get/${params.listingId}`)
        const data = await res.json()
        if (data.success === false) {
          console.log(data.message)
          setError(true)
          setLoading(false)
          return
        }
        setListing(data)
        setLoading(false)
      } catch (err) {
        setError(true)
        setLoading(false)
      }
    }
    fetchListing()
  }, []);
  return (
    <main>
      {loading &&
        <p className={'text-center my-7 text-2xl'}>Loading...</p>
      }
      {error &&
        <p className={'text-center my-7 text-2xl'}>Something went wrong!</p>
      }
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map(url => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </main>
  );
}

export default Listing;