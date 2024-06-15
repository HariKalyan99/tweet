import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'

export const authSignup = async(request, response) => {
    try{
        const {fullname, username, email, password} = request.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return response.status(400).json({error: "Invalid email format"});
        }

        const existUser = await User.findOne({username});
        if(existUser){
            return response.status(400).json({message: "Username is already taken"});
        }
        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return response.status(400).json({message: "Email already exist"});
        }

        if(password.length < 6){
            return response.status(400).json({message: "Password must be 6 charecters long"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id, response);

            await newUser.save();
            return response.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileimg: newUser.profileimg,
                coverimg: newUser.coverimg
            })
        }else{
            return response.status(400).json({message: "Invalid user data"})
        }
        
    }catch(error){
        console.log("Error in signup controller", error.message)
        return response.status(500).json({error: "Internal Server Error"})
    }
}

export const authLogin = async(request, response) => {
    try{    
        const {username, password} = request.body;

        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if(!user || !isPasswordCorrect){
            return response.status(400).json({error: "Invalid username or password"})
        }

        generateTokenAndSetCookie(user._id, response)

        return response.status(201).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileimg: user.profileimg,
            coverimg: user.coverimg
        })

    }catch(error){
        console.log("Error in login controller", error.message)
        return response.status(500).json({error: "Internal Server Error"})
    }
}

export const authLogout = async(request, response) => {
    try {
        response.cookie("jwt", "", {maxAge: 0});
        return response.status(200).json({message: "Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller", error.message)
        return response.status(500).json({error: "Internal Server Error"})
    }
}


export const getMe = async(request, response) => {
    try {
        const user = await User.findById(request.user._id).select("-password");
        return response.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe controller", error.message)
        return response.status(500).json({error: "Internal Server Error"})
    }
}