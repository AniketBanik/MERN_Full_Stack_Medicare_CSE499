const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        requires: true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobileno:{
        type: Number,
        required:true,
        unique:true
    },

    
    age:{
        type: Number,
        required: true

    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    date:{

        type:Date,
        default:Date.now

    }
});

module.exports = User = mongoose.model('user',UserSchema);