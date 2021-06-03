const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({

    user: {
        type:Schema.Types.ObjectId,
<<<<<<< HEAD
<<<<<<< HEAD
        ref: 'users' //All users are connected to posts here
=======
        ref: 'users' //user connected to posts here
>>>>>>> 0c03d20b488d2491df427f6e52a82fb7c2294aff
=======
        ref: 'users' //user connected to posts here
>>>>>>> 0c03d20b488d2491df427f6e52a82fb7c2294aff
    },


    cardiodept: {
        type: String,
        required: true
    },

});

module.exports = Post = mongoose.model('post',PostSchema);