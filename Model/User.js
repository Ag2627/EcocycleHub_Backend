import mongoose, { trusted } from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        min:2,
        max:30
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
    },
    address:{
        type:String,
    },
    status: {
    type: String,
    enum: ["active", "flagged", "removed"],
    default: "active",
    },
    points: {
    type: Number,
    default: 0,
  },
  reportsCount: {
    type: Number,
    default: 0,
  },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
})

const User=mongoose.model('User',userSchema);
export default User;