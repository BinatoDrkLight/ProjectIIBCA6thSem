import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import { useRef } from "react";
import { useCountGridCols } from "../utils/CountGridCols";
import { useLocation } from "react-router-dom";
import FindOpponent from "../utils/FindOpponent";
import toast from "react-hot-toast";

const ProductDetails = () => {

    const {products, navigate, currency, addToCart, user, axios} = useAppContext();
    const {id} = useParams();
    const [relatedProducts, setRelatedProducts] = useState();
    const [thumbnail, setThumbnail] = useState(null);

    const location = useLocation();
    const indexP = location.state?.index;
    const colsP = location.state?.cols;
    const productsP = location.state?.products;

    const gridRef = useRef(null);
    const cols = useCountGridCols(gridRef);

    const product = products.find((item) => item._id === id);

    const opponents = FindOpponent(indexP, colsP, Object.keys(productsP).length);
    const opponentsWithId = [];
    for(let opponent of opponents){
        opponentsWithId.push(products[opponent]._id);
    }

    const userId = user._id
    const from = 'click'
    const updateClickRating = async () =>{
        try{
            const {data} = await axios.post('/api/product/update-click-rating', {product, opponentsWithId, userId, from});
           
            if(data.success){
                toast("success click update")
            } else {
                toast.error(data.message)
            }
        } catch (error){
            console.log(error.message)
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        if(product.clickFlag?.[userId] === 'false' || product.clickFlag?.[userId] === undefined){
            const updateAfterFiveSec = setTimeout(() => {
            updateClickRating();
            }, 5000);

            return () => clearTimeout(updateAfterFiveSec)
        }
    }, [product, userId])

    useEffect(()=>{
        if(products.length > 0){
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((item)=> product.category === item.category)
            setRelatedProducts(productsCopy.slice(0,5))
        }
    }, [products])

    useEffect(()=>{
        setThumbnail(product?.image[0] ? product.image[0] : null)
    }, [product])

    return product && (
        <div className="mt-12">
            <p>
                <Link to={"/"}>Home</Link> /
                <Link to={"/products"}> Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`}> {product.category}</Link>
                <span className="text-primary"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-16 mt-4">
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3">
                        {product.image.map((image, index) => (
                            <div key={index} onClick={() => setThumbnail(image)} className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer" >
                                <img src={image} alt={`Thumbnail ${index + 1}`} />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
                        <img src={thumbnail} alt="Selected product" className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (
                            <img src={i<4 ? assets.starIconDull : assets.starIcon} alt="" className="md:w-4 w-3.5"/>
                        ))}
                        <p className="text-base ml-2">(4)</p>
                    </div>

                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">MRP: {currency}{product.price}</p>
                        <p className="text-2xl font-medium">MRP: {currency}{product.offerPrice}</p>
                        <span className="text-gray-500/70">(inclusive of all taxes)</span>
                    </div>

                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button onClick={()=> addToCart(product._id, product.inStockAmount, indexP, colsP, productsP)} className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition" >
                            Add to Cart
                        </button>
                        <button onClick={()=> {addToCart(product._id, product.inStockAmount); navigate("/cart")}} className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition" >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
            {/* -------------------------------- related products ---------------------------- */}
            <div className="flex flex-col items-center mt-20">
                <div className="flex flex-col items-center w-max">
                    <p className="text-3xl font-medium">Related Products</p>
                    <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
                </div>
                <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
                    {relatedProducts?.filter((product)=>product.inStock)
                    .map((product, index)=>(
                        <ProductCard key={index} product={product} index={index} cols={cols} products={relatedProducts} />
                    ))}
                </div>
                <button onClick={()=> {navigate('/products'); scrollTo(0,0)}} 
                className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition">See more</button>
            </div>
        </div>
    );
};

export default ProductDetails