import express from 'express';
import authUser from '../middlewares/authUser.js';
import { failureResEsewa, getAllOrders, getUserOrders, updateOrderStatus, placeOrderCOD, placeOrderEsewa, placeOrderStripe, successResEsewa} from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.get('/user', authUser, getUserOrders)
orderRouter.get('/seller', authSeller, getAllOrders)
orderRouter.post('/update-orderstatus', authSeller, updateOrderStatus)

orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/esewa', authUser, placeOrderEsewa)
orderRouter.get('/esewa/success', successResEsewa)
orderRouter.get('/esewa/failure', failureResEsewa)

export default orderRouter;