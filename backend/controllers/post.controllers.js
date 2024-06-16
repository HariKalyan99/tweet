import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import {v2 as cloudinary} from 'cloudinary'

export const createPost = async(request, response) => {
    try {
        const {text} = request.body;

        let {img} = request.body;

        const userId = request.user._id.toString();
        const user = await User.findById(userId);

        if(!user){
            return response.status(404).json({message: "User not found"});
        }

        if(!text && !img){
            return response.status(400).json({error: "post must have a text or an image"})
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        })

        await newPost.save();
        return response.status(201).json(newPost);
    } catch (error) {
        console.log('Error in createPost controller', error.message)
        response.status(500).json({errors: "Internal server error"});
    }
}

export const deletePost = async(request, response) => {
    try {
        const {id} = request.params;
        const post = await Post.findById(id);

        if(!post){
            return response.status(404).json({error: "Post not found"});
        }

        if(post.user.toString() !== request.user._id.toString()){
            return response.status(401).json({error: "You are not authorized to delete this post"})
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(id);

        return response.status(200).json({message: "Post deleted successfully"})

    } catch (error) {
        console.log("Error in the deletePost controller: ", error);
        return response.status(500).json({error: "Internal server error"})
    }
}