import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";
import FindOpponent from "../utils/FindOpponent";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({children}) => {
    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [products, setProducts] = useState([])

    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState({})

    // Fetch Seller Status
    const fetchSeller = async ()=>{
        try {
            const {data} = await axios.get('/api/seller/is-auth');
            if(data.success){
                setIsSeller(true)
            } else {
                setIsSeller(false)
            }
        } catch (error) {
            setIsSeller(false)
        }
    }

    // Fetch User Auth Status, User Data and Cart Items
    const fetchUser = async ()=>{
        try {
            const {data} = await axios.get('api/user/is-auth');
            if(data.success){
                setUser(data.user)
                setCartItems(data.user.cartItems)
            }
        } catch (error) {
            setUser(null)
        }
    }

    //Fetch all products
    const fetchProducts = async ()=>{
        try {
            const { data } = await axios.get('/api/product/list')
            if(data.success){
                setProducts(data.products)
                //setInStockAmount(data.products)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    /********************************************* InStockAmount *****************************************************/
    /***************************************************************************************************************/
    //Add Products to Cart
    const addToCart = (itemId, amount, index, cols, products = products)=>{
        let cartData = structuredClone(cartItems);

        const opponents = FindOpponent(index, cols, Object.keys(products).length);
        const opponentsWithId = [];
        for(let opponent of opponents){
            opponentsWithId.push(products[opponent]._id);
        }

        const today = new Date();
       
        if(cartData[itemId]){
            if(amount > cartData[itemId].amount){
                cartData[itemId].amount += 1;
                toast.success("Added to Cart")
            } else {
                toast.error("No item left in the stock");
            }
        }else{
            cartData[itemId] = {amount: 1, date: today, opponents: opponentsWithId};
            toast.success("Added to Cart")
        }
        setCartItems(cartData)
    }

    //Update Cart Item Quantity
    const updateCartItem = (itemId, quantity)=>{
        let cardData = structuredClone(cartItems);
        cardData[itemId].amount = quantity;
        setCartItems(cardData)
        toast.success("Cart Updated")
    }

    //Remove Product from Cart
    const removeFromCart =  (itemId)=>{
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId].amount -= 1;
            if(cartData[itemId].amount === 0){
                delete cartData[itemId];
            }
        }
        toast.success("Removed from Cart")
        setCartItems(cartData)
    }

     //Remove All Product from Cart
    const removeAllFromCart =  (itemId)=>{
        let cartData = structuredClone(cartItems);
        delete cartData[itemId];

        toast.success("Removed from Cart")
        setCartItems(cartData)
    }

    //Get Cart Item Count
    const getCartCount = ()=>{
        let totalCount = 0;
        for(const item in cartItems){
            totalCount += cartItems[item].amount;
        }
        return totalCount;
    }

    //Get Cart Total Amount
    const getCartAmount = ()=>{
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=> product._id === items);
            if(cartItems[items].amount > 0 && itemInfo){
                totalAmount += itemInfo.offerPrice * cartItems[items].amount
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(()=>{
        fetchUser()
        fetchSeller()
        fetchProducts()
    },[])

    // Update Database Cart Items
    useEffect(()=>{
        const updateCart = async ()=>{
            try {
                const { data } = await axios.post('/api/cart/update', {cartItems})
                if(!data.success){
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }

        if(user){
            updateCart()
        }

    },[cartItems])

    const value = {navigate, user, setUser, setIsSeller, isSeller, showUserLogin, setShowUserLogin, products, 
        currency, addToCart, updateCartItem, removeFromCart, removeAllFromCart, cartItems, searchQuery, setSearchQuery, getCartAmount,
        getCartCount, axios, fetchProducts, setCartItems,
    }
        return <AppContext.Provider value = {value}>
            {children}
        </AppContext.Provider>
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}