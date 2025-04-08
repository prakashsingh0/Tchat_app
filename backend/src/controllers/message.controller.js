import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import Message from '../models/message.model.js'
import { getReceiverSocketId, io } from "../lib/socket.js";




const getUsersForSidebar = async (req, res) => {
    try {
        const loggedIdUserId = req.user._id;
        const filterUsers = await User.find({ _id: { $ne: loggedIdUserId } }).select("-password");
        res.status(200).json(filterUsers);
    } catch (error) {
        console.log("Error in getUserForSidebar: ", error.message);
        res.status(500).json({ message: 'Internal Server Error' });


    }
}

const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        
        
        const myId = req.user._id;
        
        
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        });

        
        
        return res.status(200).json(messages)
    } catch (error) {

    }
}

const sendMessage = async (req, res) => {
    
    
    
    try {
        const {text, image} = req.body;
        
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        let imageUrl;
        if(image){
            // upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        });
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        

        return res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller:",error.message);
        return res.status(500).json({message:"Internal Server Error"});
        

    }
}

export { getUsersForSidebar, getMessages, sendMessage }