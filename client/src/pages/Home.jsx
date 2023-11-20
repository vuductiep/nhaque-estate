import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css/bundle'
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";

export default function Home() {
  const [offerListings, setOfferListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  const [rentListings, setRentListings] = useState([])

  SwiperCore.use(Navigation)

  useEffect(() => {
    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=4`)
        const data = await res.json()
        setRentListings(data)
      } catch (error) {
        console.log(error)
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=4`)
        const data = await res.json()
        setSaleListings(data)
      } catch (error) {
        console.log(error)
      }
    }
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=4`)
        const data = await res.json()
        setOfferListings(data)

        fetchRentListings()
        fetchSaleListings()
      } catch (error) {
        console.log(error)
      }
    }

    fetchOfferListings()
  }, []);

  return (
    <div>
      {/*  top */}
      <div className={'flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto'}>
        <h1 className={'text-slate-700 font-bold text-3xl lg:text-6xl'}>
          Find your next <span className={'text-slate-500'}>perfect</span>
          <br/>
          place with ease
        </h1>
        <div className={'text-gray-400 text-xs sm:text-sm'}>
          Nhaque Estate is the best place to find your next perfect place to live
          <br/>
          We have a wide range of properties for you to choose from
        </div>
        <Link to={'/search'} className={'text-xs sm:text-sm text-blue-800 font-bold hover:underline'}>
          Let's get started
        </Link>

      </div>

      {/*  swiper */}
      <Swiper navigation>
        {
          offerListings && offerListings.length > 1 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div key={listing._id}
                style={{background: `url(${listing.imageUrls[0]}`, backgroundSize: "cover"}}
                   className={'h-[500px]'}
              >

              </div>
            </SwiperSlide>
          ))
        }
      </Swiper>

      {/*  listing for offers */}
      <div className={'max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'}>
        {
          offerListings && offerListings.length > 0 && (
            <div>
              <h1></h1>
            </div>
          )
        }
      </div>
    </div>
  )
}