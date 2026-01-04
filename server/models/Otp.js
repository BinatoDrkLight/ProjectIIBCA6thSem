import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    userId: {type: String, refs: 'user'},
    email: {type: String},
    otpCode: {type: Number, required: true},
    purpose: {type: String, required: true, default: 'register'},
    isUsed: {type: Boolean, required: true, default: 'false'},
    expiresAt: {type: Number, required: true}
}, { timestamps: true })

const Otp = mongoose.models.otp || mongoose.model('otp', otpSchema)

export default Otp;