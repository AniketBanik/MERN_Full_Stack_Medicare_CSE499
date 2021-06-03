const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({

    user: {
        type:Schema.Types.ObjectId,
        ref: 'users' //user connected to posts here
    },


    cardiodept: {
        type: String,
        required: true
    },

});

module.exports = Post = mongoose.model('post',PostSchema);