import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    const secret = process.env.JWT_SECRET
    try {
        const token = req.cookies.authToken

        if (!token) return res.status(401).json({ message: 'User not logged in' })

        const decodedcookie = jwt.verify(token, secret)

        if (!decodedcookie) return res.status(401).json({ message: "Invalid token" })
        
        const user = await User.findById(decodedcookie.userId).select('-password')

        if (!user) return res.status(404).json({message: 'User not found'})

        req.user = user

        next()

    } catch (err) {
        console.log("Error in protect route", err.message);
        return res.status(500).json({message: "Internal server error"})
    }
}