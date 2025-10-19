import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
    <div className='relative'>
        <img src={assets.plantBanner2} alt="plant banner" className="w-full h-full hidden md:block"/>
        <img src={assets.plantBanner2Sm} alt="plant banner" className="w-full h-[26rem] md:hidden"/>
        <div className='absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-28'>
          <h1 className='text-white md:text-inherit text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15'
          >Your Plants, Your Sanctuary</h1>
        
          <div className='flex item-center mt-6 font-medium'>
            <Link to={"/products"} className='group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer'>
            Shop now
            <img className='w-6 h-6 md:hidden transition group-focus:translate-x-1' src={assets.whiteArrowIcon} alt="whiteArrow" />
            </Link>

            <Link to={"/products"} className='group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer'>
            Explore deals
            <img className='w-6 h-6 transition group-hover:translate-x-1' src={assets.blackArrowIcon} alt="blackArrow" />
            </Link>
          </div>
        </div>
      </div>
  )
}

export default MainBanner