import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets, dummyOrders } from '../../assets/assets';
import toast from 'react-hot-toast';

const Orders = ()=>{

    const {currency, axios} = useAppContext()
    const [orders, setOrders] = useState([])

    const fetchOrders = async ()=>{
        try {
            const {data} = await axios.get('/api/order/seller');
            if(data.success){
                setOrders(data.orders)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    };

    const updateOrderDetails = async (orderId, selectedValue)=>{
        try{
            const {data} = await axios.post('/api/order/update-orderstatus', {orderId, orderStatus: selectedValue});
            if(data.success){
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        fetchOrders();
    }

    useEffect(()=>{
        fetchOrders();
    }, [])

    return (
        <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
            <div className="md:p-10 p-4 space-y-4">
                <h2 className="text-lg font-medium">Orders List</h2>
                {orders.map((order, index) => (
                    <div key={index} className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-6xl rounded-md border border-gray-300">
                        <div className="flex gap-5 max-w-80">
                            <img className="w-12 h-12 object-cover" src={assets.boxIcon} alt="boxIcon" />
                            <div>
                                <span className='text-sm'>Order Id: {order._id}</span>
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex flex-col">
                                        <p className="font-medium">
                                            {item.product.name}{" "} <span className='text-primary'>x {item.quantity}</span><br></br>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-sm md:text-base text-black/60">
                            <p className='text-black/80'>{order.address.firstName} {order.address.lastName}</p>
                            <p>{order.address.street}, {order.address.city}</p>
                            <p>{order.address.state}, {order.address.zipcode}, {order.address.country}</p>
                            <p></p>
                            <p>{order.address.phone}</p>
                        </div>

                        <p className="font-medium text-lg my-auto">{currency}{order.amount}</p>

                        <div className="flex flex-col text-sm md:text-base text-black/60">
                            <p>Method: {order.paymentType}</p>
                            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                        </div>

                        <div className="flex flex-col text-sm md:text-base text-black/60">
                            <p>Package Details: </p>
                            <select name="Order" value={order.orderStatus} className='border p-2' onChange={(e) => updateOrderDetails(order._id, e.target.value)}>
                                <option value="Order Placed">Order Placed</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipping">Shipping</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Orders