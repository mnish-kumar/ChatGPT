const mongoose = require('mongoose');


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
    plan: {
        type: String,
        enum: ["free", "premium"],
        default: "free"
    }
},
    {
        timestamps: true,
    }
)

// userSchema.index({ email: 1 }, { unique: true });
const userModel = mongoose.model('user', userSchema);

module.exports = userModel;