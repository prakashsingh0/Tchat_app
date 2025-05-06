import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userName:{
        type:String,
        require:true
    },
    userPic:{type:String,
        require:true
    },
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

    comments: [
        {
            commnet: { type: String },
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        }
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

},
    { timestamps: true }
)

const Post = mongoose.model("tPost", postSchema)

export default Post;