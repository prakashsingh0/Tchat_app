import cloudinary from "../lib/cloudinary.js"

import User from "../models/user.model.js"
import Post from '../models/post.model.js'



const Posts = async (req, res) => {
    try {
        const { image, title } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: "User not logged in" });
        }

        const userInDb = await User.findById(userId);
        if (!userInDb) {
            return res.status(404).json({ message: "User not found" });
        }

        let imageUrl = null;

        if (image) {
            // upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newPost = new Post({
            userName: userInDb.fullName,
            userPic: userInDb.profilePic,
            description: title,
            image: imageUrl,
            userId: userId
        });

        await newPost.save();

        return res.status(200).json({ message: "Post created successfully" });

    } catch (error) {
        console.error("Error in post controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



// getAllPost 
const getAllpost = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "User not logged in" });
        }

        const loggedInUser = await User.findById(userId);
        if (!loggedInUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get all posts in the database
        const allPosts = await Post.find({}).sort({ createdAt: -1 }); // Optional: sorted by newest first

        return res.status(200).json({ posts: allPosts });

    } catch (error) {
        console.error("Error fetching all posts:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//getFollowingPost
const getFollowingPost = async (req, res) => {
    try {
        const id = req.user._id;
        const loggedInUser = await User.findById(id);
        const followingUserPost = await Promise.all(loggedInUser.following.map((otherUserId) => {
            return Post.find({ userId: otherUserId })
        }))
        return res.status(200).json({
            posts: [].concat(...followingUserPost)
        })
    } catch (error) {
        console.log(error);
    }
}

//like or Dislike post
const likeOrDislike = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const postId = req.params.id;

        // console.log(postId)

        const postInDB = await Post.findById(postId);

        if (!postInDB) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (postInDB.likes && postInDB.likes.includes(loggedInUserId)) {
            // Dislike
            await Post.findByIdAndUpdate(postId, { $pull: { likes: loggedInUserId } });
            res.status(200).json({ message: "User disliked your post" });
        } else {
            await Post.findByIdAndUpdate(postId, { $push: { likes: loggedInUserId } });
            res.status(200).json({ message: "User liked your post" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//Get_My_Post
const MyPost = async (req, res) => {
    try {

        const post = await Post.find({ userId: req.user._id }).populate("userId", "_id  description ");
        res.status(200).json({ posts: post });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

//Delete Post
const DeletePost = async (req, res) => {
    try {
        const postFound = await Post.findById(req.params.id);
        // console.log(req.params.id);
        if (!postFound) {
            return res.status(400).json({ error: "Post does not exist" });
        }
        // Check if the post author is the same as the logged-in user, then allow deletion
        if (postFound.userId._id.toString() === req.user._id.toString()) {
            await Post.deleteOne({ _id: req.params.id });
            return res.status(200).json({ message: "post deleted successfully" });
        } else {
            return res.status(401).json({ error: "Unauthorized to delete this post" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const comments = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

    } catch (error) {
        console.log("Error in comments controller", error);
        return res.status(500).json({ message: "Internal Server Error" });

    }
}


export { Posts, DeletePost, MyPost, likeOrDislike, getFollowingPost, getAllpost, comments }