import React from 'react';
import { categories } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Categories = ()=>{

    const {navigate} = useAppContext()

    return (
       <div className='mt-10'>
            <p className='text-2xl md:text-3xl font-medium'>Categories</p>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-2 gap-6 md:gap-10'>

                {categories.map((category, index)=>(
                    <div key={index} className='group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center'
                    style={{backgroundColor: category.bgColor}}
                    onClick={()=>{
                        navigate(`/products/${category.path.toLowerCase()}`)
                        scrollTo(0,0)
                    }}
                    > 
                        <img src={category.image} alt={category.text} className='w-30 h-30 md:w-40 md:h-40 object-cover group-hover:scale-105 transition-transform'/>
                        <p className='text-sm md:text-lg font-medium'>{category.text}</p>
                    </div>
                ))}

            </div>
       </div>
    )
}

export default Categories