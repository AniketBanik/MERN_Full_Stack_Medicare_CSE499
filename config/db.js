const mongoose = require('mongoose');

const config = require('config');

const db = config.get('mongoURI');

const connectDB =async () => {

    try{
        await mongoose.connect(db, {
            useNewUrlParser:true, useUnifiedTopology: true ,

            useFindAndModify : false, // for the error message DeprecationWarning for this version of mongoose
            useCreateIndex:true//mongoose error solution
            
           


    });

        console.log('MongoDB Connected...');
        

    } catch(err){

        console.error(err.message);
        //Exit process with failure
        process.exit(1);


    }

    


};

module.exports = connectDB;
