import React from 'react';
import ProductCard from './ProductCard';
import { useAppContext } from '../context/AppContext';
import { useRef } from 'react';
import { useCountGridCols } from '../utils/CountGridCols';
import { useState } from 'react';
import { useEffect } from 'react';

const TrendingProduct = () => {
    const { products } = useAppContext();
    const [trendingProducts, setTrendingProducts] = useState();

    const gridRef = useRef(null);
    const cols = useCountGridCols(gridRef);

    useEffect(()=>{
        if (products.length > 0) {
            let productsCopy = products.slice();
            productsCopy = productsCopy.sort((a, b) => b.rating - a.rating).slice(0, 10);

            setTrendingProducts(productsCopy);
        }
    }, [products])

    return (
        <div className='mt-10'>
            <p className='text-2xl md:text-3xl font-medium'>Trending Product</p>
            <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 mt-6">
                {trendingProducts?.filter((product) => product.inStock)
                .map((product, index) => (
                        <ProductCard key={index} product={product} index={index} cols={cols} products={trendingProducts}/>
                    ))
                }
            </div>
        </div>
    )
}

export default TrendingProduct