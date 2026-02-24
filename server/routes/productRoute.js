import express from 'express'
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, changeStock, productById, productList, removeFromDB, updateClickRating } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/add', upload.array(["images"]), authSeller, addProduct);
productRouter.get('/list', productList)
productRouter.get('/id', productById)
productRouter.get('/stock', authSeller, changeStock)
productRouter.post('/stock', authSeller, changeStock)
productRouter.post('/remove', authSeller, removeFromDB)
productRouter.post('/update-click-rating', updateClickRating)

export default productRouter;