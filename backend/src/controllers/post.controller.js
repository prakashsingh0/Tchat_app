import cloudinary from "../lib/cloudinary.js"
import { removeLocalFile } from "../lib/multer.js";
import User from "../models/user.model.js"
import Post from '../models/post.model.js'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { log } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const Posts = async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: "User not logged in" });
        }

        const userInDb = await User.findById(userId);
        if (!userInDb) {
            return res.status(404).json({ message: "User not found" });
        }

        let fileUrl = null;
        let fileType = null;
        let resourceType = "auto"; // Cloudinary auto mode

        if (req.file && req.file.path) {

            const mime = req.file.mimetype;

            // Detect file type
            if (mime.startsWith("image/")) {
                fileType = "image";
                resourceType = "image";      // Cloudinary setting
            } 
            else if (mime.startsWith("video/")) {
                fileType = "video";
                resourceType = "video";      // Cloudinary treats video + audio as video
            }
            else if (mime.startsWith("audio/")) {
                fileType = "audio";
                resourceType = "video";      // Cloudinary requires "video" for audio
            }
            else if (
                mime === "application/pdf" ||
                mime === "application/msword" ||
                mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                mime === "application/zip"
            ) {
                fileType = "document";
                resourceType = "raw";         // ⚠️ Cloudinary required for PDF, DOC, DOCX
            }
            else {
                return res.status(400).json({ message: "Unsupported file type" });
            }

            // Upload to Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
                resource_type: resourceType,
                folder: "post",
            });

            fileUrl = uploadResponse.secure_url;

            // Remove file from local storage
            removeLocalFile(req.file.path);
        }

        const newPost = new Post({
            userName: userInDb.fullName,
            userPic: userInDb.profilePic,
            description: title,
            file: fileUrl,
            fileType: fileType,  // image, video, audio, document
            userId: userId,
        });

        await newPost.save();

        return res.status(200).json({ message: "Post created successfully", post: newPost });

    } catch (error) {
        console.error("Error in post controller:", error);

        if (req.file && req.file.path) {
            removeLocalFile(req.file.path);
        }

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
