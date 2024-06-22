import { NotificationModel } from "../models/notification.model.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import {v2 as cloudinary} from 'cloudinary';

export const getUserProfile = async(request, response) => {
    try {
        const {username} = request.params;
        const user = await User.findOne({username}).select("-password");
        if(!user){
            return response.status(404).json({message: "User not found"});
        }
        return response.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserProfile", error.message)
        return response.status(500).json({error: error.message})
    }
}


export const followUnfollowUser = async(request, response) => {
    try {
        const {id} = request.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(request.user._id);
        if(id === request.user._id.toString()){
            return response.status(400).json({error: "You can't follow or unfollow yourself"})
        }

        if(!userToModify || !currentUser) {
            return response.status(400).json({error: "User not found"})
        }

        const isFollowing = currentUser.following.includes(id);


        if(isFollowing){
            await User.findByIdAndUpdate(id, {$pull: {followers: request.user._id}});
            await User.findByIdAndUpdate(request.user._id, {$pull: {following: id}});

            //send notification to the user

            



            return response.status(200).json({message: "User unfollowed successfully"})
        }else{
            await User.findByIdAndUpdate(id, {$push : {followers: request.user._id}});
            await User.findByIdAndUpdate(request.user._id, {$push: {following: id}});

            const newNotification = new NotificationModel({
                type: "follow",
                from: request.user._id,
                to: userToModify._id,
            });

            await newNotification.save();
            return response.status(200).json({message: "User followed successfully"})
        }
    } catch (error) {
        console.log("Error in followUnfollowUser", error.message)
        return response.status(500).json({error: error.message})
    }
}

export const getSuggestedUsers = async(request, response) => {
    try {
        const userId = request.user._id;

        const usersFollowedByMe = await User.findById(userId).select('following');

        const users = await User.aggregate([
            {
                $match: {
                    _id: {$ne: userId}
                },
            },
            {
                $sample: {size: 10}
            },
        ])

        const filteredUser = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
        const suggestedUsers = filteredUser.slice(0, 4);

        suggestedUsers.forEach((user) => (user.password = null));
        response.status(200).json(suggestedUsers);

    } catch (error) {
        console.log("Error in getSuggestedUsers", error.message)
        return response.status(500).json({error: error.message})
    }
}



export const updateUserProfile = async(request, response) => {
    try {
        const {fullName, username, email, currentPassword ,newPassword, bio, link} = request.body;

        let {profileImg, coverImg} = request.body;

        const userId = request.user._id;

        let user = await User.findById(userId);
        if(!user) return response.status(404).json({message: "User not found"})

        if((!currentPassword && newPassword) || (!newPassword && currentPassword)) {
            return response.status(400).json({error: "Please provide both current password and new password"});
        }

        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password);

            if(!isMatch) return response.status(400).json({error: "Current password is incorrect"});

            if(newPassword.length < 6){
                return response.status(400).json({error: "Password must be at least 6 charecters"})
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if(profileImg){
            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        }

        if(coverImg){
            if(user.coverImg){
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0])
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();
        user.password = null

        return response.status(200).json(user);

    } catch (error) {
        console.log("Error in updateUserProfile", error.message)
        return response.status(500).json({error: error.message})
    }
}