import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    userId: {type: String, required: true, ref: 'user'},
    otpCode: {type: Number, required: true},
    purpose: {type: String, required: true, default: 'register'},
    isUsed: {type: Boolean, required: true, default: 'false'},
}, { timestamps: true })

const Otp = mongoose.models.otp || mongoose.model('otp', otpSchema)

export default Otp;