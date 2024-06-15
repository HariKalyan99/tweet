import jwt from 'jsonwebtoken';


export const generateTokenAndSetCookie = (userId, response) => {
    const token = jwt.sign({userId}, process.env.JWT_TOKEN, {
        expiresIn: '10d'
    })

    response.cookie("jwt", token, {
        maxAge: 15*24*60*60*1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    })
}