import cloudinary from '../lib/cloudinary.js';
import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js'
import bycrypt from 'bcryptjs'

const salt = await bycrypt.genSalt(10)


export const signUp = async (req, res) => {
    const { fullname, email, password } = req.body
    try {

        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields required" })
        }

        if (password.length < 6) {
            return res.status(402).json({ message: "Password must contain atleast 6 characters" });
        }

        const user = await User.findOne({ email });

        if (user) { return res.status(404).json({ message: "User already exists" }) };

        const hashedpassword = await bycrypt.hash(password, salt)

        const newUser = new User({
            fullname,
            email,
            password: hashedpassword
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        }
        else {
            res.status(400).json({ message: "Invalid user data" })
        }

    }
    catch (err) {
        console.log("Error in signup controller", err.message);
        res.status(500).json({ message: "Internal Server Error" })

    }
}

export const logIn = async (req, res) => {
    const { email, password } = req.body
    try {
        // console.log("LOgIn controller");
        
        if (!email || !password) {
            return res.status(400).json({ message: "All fields required" })
        }
        const user = await User.findOne({ email })

        if (!user) return res.status(400).json({ message: "User doesnt exist" })

        const isPasswordCorrect = await bycrypt.compare(password, user.password)

        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credintials" })

        generateToken(user._id, res)

        res.status(201).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic
        })

    } catch (err) {
        console.log("Error in login controller", err.message);
        res.status(500).json({ message: "Internal server error" })

    }
}

export const logOut = (req, res) => {
    try {
        res.cookie("authToken", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out successfully" })
    } catch (err) {
        console.log("Error in logout controller", err.message);
        res.status(500).json({ message: "Internal server error " })

    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body
        const userId = req.user._id

        if (!profilePic) return res.status(400).json({ message: "Profile picture required" })

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })

        res.status(200).json(updatedUser)

    } catch (err) {
        console.log("Error in update profile", err);
        res.status(500).json({ message: "Internal server error" })

    }
}

export const checkAuthenticated = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (err) {
        console.log('Error in checkAuthenticated controller', err.message);
        res.status(500).json({ message: "Internal server error" })
    }
}