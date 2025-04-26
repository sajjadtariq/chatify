import jwt from 'jsonwebtoken'
export const generateToken = (userId, res) => { 
    const secret = process.env.JWT_SECRET
    const securetrue = process.env.NODE_ENV

    const token = jwt.sign({userId}, secret, {
        expiresIn: '7d'
    })
    res.cookie("authToken", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        httpOnly: true,
        sameSite: 'strict',
        secure: securetrue !== "development"
    })
    return token;
}