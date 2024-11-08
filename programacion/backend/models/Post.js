import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    userId: String,
    text: String,
},
{ timestamps: true }
);

const postSchema = mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
         type: String,
        required: true,
    },
    petId:{
        type: String,
        required: true,
    },
    petName:{
        type: String,
        required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
        type: Map,
        of: Boolean,
    },
    comments: [commentSchema]
},
{ timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;