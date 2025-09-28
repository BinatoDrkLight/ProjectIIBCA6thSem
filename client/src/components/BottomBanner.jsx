import React from 'react';
import { assets, features} from '../assets/assets';

const BottomBanner = ()=>{
    return (
        <div className='relative mt-22'>
            <img src={assets.BottomBanner} alt="bottomBanner" className='w-full lg:h-110 hidden lg:block'/>
            <img src={assets.BottomBannerSm} alt="bottomBannerSm" className='mx-auto w-full h-[30rem] sm:h-[36rem] md:h-[34rem] lg:hidden'/>

            <div className='absolute inset-0 flex flex-col items-center justify-center lg:items-end lg:justify-center p-6 px-8 xl:pr-24'>
                    <div>
                        <h1 className='text-center text-xl sm:text-3xl md:text-3xl font-semibold text-primary mb-2 sm:mb-8 md:mb-2'>Why We Are The Best?</h1>
                        {features.map((feature, index)=>(
                            <div key={index} className='flex items-center gap-4 sm:gap-6 mt-3 xl:mt-5'>
                                <div className='bg-primary p-2 h-8 w-8 sm:h-12 sm:w-12 md:h-10 md:w-10 flex items-center justify-center shrink-0'>
                                    <img src={feature.icon} alt={feature.title} className=' w-4 sm:w-6 md:w-8 lg:w-11'/>
                                </div>
                                <div>
                                    <h3 className='text-xs sm:text-lg lg:text-xl font-semibold'>{feature.title}</h3>
                                    <p className='text-gray-500/70 text-[0.6rem] lg:text-sm'>{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
            </div>
        </div> 
    )
}

export default BottomBanner

