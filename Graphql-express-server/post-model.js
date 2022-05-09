import {mongoose} from 'mongoose';

// Schema for mongoose db
const PostSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
    
    },
    points:{
        type: Number
    },
    
})

export const Post = mongoose.model('post', PostSchema)
