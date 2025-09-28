import React from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';


const ProductCard = ({product}) => {
    const {currency, addToCart, removeFromCart, cartItems, navigate} = useAppContext()

    return product && (
        <div onClick={()=> {navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0,0)}} className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white w-full h-full">
            <div className="group cursor-pointer flex items-center justify-center py-1">
                <img className="w-30 h-30 md:w-40 md:h-40 object-cover group-hover:scale-105 transition-transform" src={product.image[0]} alt={product.name} />
            </div>
            <div className="text-gray-500/60 text-sm">
                <p>{product.category}</p>
                <p className="text-gray-700 font-medium text-md md:text-lg truncate w-full">{product.name}</p>
                <div className="flex items-center gap-0.5">
                    {Array(5).fill('').map((_, i) => (
                           <img key={i} className="md:w-4 w-3.5" src={i<4 ? assets.starIconDull : assets.starIcon}/>
                    ))}
                    <p>({4})</p>
                </div>
                <div className="flex items-end justify-between mt-3">
                    <p className="text-md sm:text-lg md:text-xl text-base font-medium text-primary">
                        {currency}{product.offerPrice}{" "} <span className="text-gray-500/60 text-xs md:text-sm line-through block sm:inline-block">{currency}{product.price}</span>
                    </p>
                    <div onClick={(e) => {e.stopPropagation(); }} className="text-primary">
                        {!cartItems[product._id] ? (
                            <button className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 w-[3.4rem] h-[1.8rem] md:w-[80px] rounded cursor-pointer" onClick={() => addToCart(product._id)} >
                                <img className="w-4 h-4 md:w-5 md:h-5" src={assets.addToCart} alt="cartIcon"/>
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                                <button onClick={() => removeFromCart(product._id)} className="cursor-pointer text-md px-2 h-full" >
                                    -
                                </button>
                                <span className="w-5 text-center">{cartItems[product._id]}</span>
                                <button onClick={() => addToCart(product._id)} className="cursor-pointer text-md px-2 h-full" >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard