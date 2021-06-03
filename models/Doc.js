const mongoose = require('mongoose');

const DocSchema = new mongoose.Schema({
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
    department:{
        type: String,
        required:true,
        unique:true
    },
    gender:{
        type: String,
        required:true,
        unique:true
    },
    age:{
        type: String,
        required:true,
        unique:true
    },

    

    degree:{
        type: String,
        required: true

    },
    medicalcollege:{
        type: String,
        required: true

    },
    visit:{
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

module.exports = Doc = mongoose.model('doc',DocSchema);