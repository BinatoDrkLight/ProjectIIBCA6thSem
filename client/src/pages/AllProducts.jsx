import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { useCountGridCols } from '../utils/CountGridCols';

const AllProducts = () => {

    const {products, searchQuery} = useAppContext()
    const [filteredProducts, setFilteredProducts] = useState([])

    const gridRef = useRef(null);
    const cols = useCountGridCols(gridRef);

    useEffect(()=>{
        if(searchQuery.length > 0){
            setFilteredProducts(products.filter(
                product => product.name.toLowerCase().includes(searchQuery.toLowerCase())
            ))
        } else {
            setFilteredProducts(products)
        }
    },[products, searchQuery])

    return (
        <div className='mt-16 flex flex-col'>
            <div className='flex flex-col items-end w-max'>
                <p className='text-2xl font-medium uppercase'>All Products</p>
                <div className='w-16 h-0.5 bg-primary rounded-full'></div>
            </div>

            <div ref={gridRef} className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
                {filteredProducts.filter((product)=> product.inStock).map((product, index)=>(
                        <ProductCard key={index} product={product} index={index} cols={cols} products={filteredProducts} /> //use index as position
                ))}
            </div>
        </div>
    )
}

export default AllProducts