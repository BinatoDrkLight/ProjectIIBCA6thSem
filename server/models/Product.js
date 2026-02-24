import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: Array, required: true},
    price: {type: Number, required: true},
    offerPrice: {type: Number, required: true},
    image: {type: Array, required: true},
    category: {type: String, required: true},
    inStock: {type: Boolean, default: true},
    inStockAmount: {type: Number, required: true},
    rating: {type: Number, default: 1500},
    rd: {type: Number, default: 350},
    sigma: {type: Number, default: 0.06},
    addToCartFlag: {type: Object, default: {}},
    clickFlag: {type: Object, default: {}}
}, {timestamps: true})

const Product = mongoose.models.product || mongoose.model('product', productSchema)

export default Product