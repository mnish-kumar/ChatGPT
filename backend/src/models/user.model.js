const mongoose = require('mongoose');


const planSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["FREE", "PREMIUM"],
        default: "FREE",
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    expiry: {
        type: Date,
    },

    razorpaySubscriptionId: {
        type: String,
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullname:{
        firstname:{
            type:String,
            required:true,
        },
        lastname:{
            type:String,
            required:true,
        }
    },
    password:{
        type:String,
        required:true,
    },
    isEmailVerified:{
        type:Boolean,
        default:false,
    },
    plan: planSchema
},
    {
        timestamps: true,
    }
)



const userModel = mongoose.model('user', userSchema);

module.exports = userModel;