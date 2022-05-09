import mongoose from 'mongoose';
const { Schema } = mongoose;
const {model} = mongoose

// Mongoose schema model for user details

const user = {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
  
    },
    
  
};

const schema = new Schema(user);

export const User = model("User", schema);


