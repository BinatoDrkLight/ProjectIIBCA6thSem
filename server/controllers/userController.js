import User from "../models/User.js";
import Otp from "../models/Otp.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from "../configs/sendEmail.js";
import { google } from "googleapis";

// Login User : /api/user/otp-verification
export const otpVerification = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.json({success: false, message: 'Missing Details'})
        }

        const existingUser = await User.findOne({ email })

        if(existingUser){
            return res.json({success: false, message: 'User already exists'})
        }
            

        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

        await Otp.create({email: email, otpCode: otp, expiresAt: expiresAt})

        await sendEmail(email, otp);
        res.json({ success: true, message: 'OTP sent' });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Email failed' });
    }
}

export const register = async (req, res) => {
    try {
        const {name, email, password, otp} = req.body;

        if(!name || !email || !password || !otp){
            return res.json({success: false, message: 'Missing Details'})
        }
        
        const otpDB = await Otp.findOne({email: email}).sort({createdAt: -1});
        if(otp != otpDB.otpCode){
            res.json({ success: false, message: "Invalid OTP" });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)

            const user = await User.create({name, email, password: hashedPassword})
            if(user){
                await Otp.updateOne({ email: email }, { $set: {userId: user._id, isUsed: true }, $unset: { email: "" } }, { sort: {createdAt: -1} }) 
            } else {
                return res.json({ success: false, message: "User not created"})
            }
           

            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

            res.cookie('token', token, {
                httpOnly: true, //Prevent Javascript to access cookie
                secure: process.env.NODE_ENV === 'production', //Use secure cookies in production
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //CSRF protection
                maxAge: 7 * 24 * 60 * 60 * 1000, //Cookie expiration time in ms
            })

            return res.json({success: true, user: {email: user.email, name: user.name}})
        }
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Login User : /api/user/login
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password)
            return res.json({success: false, message: 'Email and password are required'});
        const user = await User.findOne({email});

        if(!user){
            return res.json({success: false, message: 'Invalid email or password'});
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch)
            return res.json({success: false, message: 'Invalid email or password'});
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({success: true, user: {email: user.email, name: user.name}})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

//Login User with google : /api/user/google-url
export const googleUrl = (req, res) => {
    try{
        // OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
        );

        const SCOPES = [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email"
        ];

        const authUrl = oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: SCOPES
        });
        return res.json({success: true, url: authUrl})
    } catch(error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Redirect URI : /api/user/oauth2callback
export const redirectOauth = async (req, res) => {
    const code = req.query.code;
    if (!code) return res.send("No authorization code");

    try {
        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Fetch user profile
        const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: "v2"
        });

        const { data } = await oauth2.userinfo.get();
        //const ifUser = await User.findOne(data.email);

        const user = await User.create(data.name, data.email)

         const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

            res.cookie('token', token, {
                httpOnly: true, //Prevent Javascript to access cookie
                secure: process.env.NODE_ENV === 'production', //Use secure cookies in production
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //CSRF protection
                maxAge: 7 * 24 * 60 * 60 * 1000, //Cookie expiration time in ms
            })

            return res.redirect(`${process.env.FRONTEND_BASE_URL}/`);
    }catch(error){
        console.error(error);
        res.status(500).send("Authentication failed");
    }
}

// Check auth : /api/user/is-auth
export const isAuth = async (req, res) => {
    try{
        const { userId } = req.body;
        const user = await User.findById(userId).select("-password")
        return res.json({ success: true, user });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Logout User : /api/user/logout
export const logout = async (req, res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}