import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        fullName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        profilePic: {
            type: String,
            default: ''
        },
        followers: {
            type: Array,
            default: []
        },
        following: {
            type: Array,
            default: []
        },
        post:[
            { 
                image: {
                    type: String,
                    require: true
                },
                description: {
                    type: String,
                    require: true
                },
                likes: {
                    type: Array,
                    default: []
                },
                userDetails: {
                    type: Array,
                    default: []
                },
                comments: [
                    {
                        commnet: { type: String },
                        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
                    }
                ],}
        ],
    },
    { timestamps: true }
)
const User = mongoose.model("User", userSchema);
export default User;