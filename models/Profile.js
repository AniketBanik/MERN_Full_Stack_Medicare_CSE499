const mongoose = require ('mongoose');


const ProfileSchema = new mongoose.Schema(
    //main starting array/fields in profile of a user ...ttttt
    {

    user : {
        type : mongoose.Schema.Types.ObjectId, //connection with user's individual id
        ref : 'user'
    } , 

    location:{
        type: String,
        required:true
    },

    bio : {
        type:String
    },
    
    


   // medicalreport array
    healthcondition: [
        {
            bloodsugarlevel:{
                type:String,
               
                required: true
        
            },
            bloodpressure:{
                
                type:String,
                required: true
        
            },
            bloodgroup:{
                
                type:String,
                required: true
        
            },
            sufferingfrom:{
                type:String,
                required: true
        
                
        
            },

           howlongsufferingfrom:{
                type:String,

               required: true,
        
                
        
            },
            

            othercomplications: {
                type:String,
                required: true

            },
            spectaclespower: {
                type:String,
                required: true

            },
            anyallergy: {
                type:String,
                required: true

            },
            anycovid: {
                type:String,
                required: true

            },

            

        }
    ],

    patientinformations : [
        {
            name:{
                type:String,
                required: true
        
            },
            age:{
                type:Number,
                required: true
        
            },
            gender:{
                type:String,
                required:true
                
        
            },
            permanentaddress:{
                type:String,
                required: true
        
            },
            presentaddress:{
                type:String,
                required: true
                
        
            },

            emailaddress: {
                type : String,
                required: true

            },

            mobileno:{
                type:Number,
                required: true
                
        
            },
            nidorbirthcirtificateno:{
                type:Number,
                required: true
                
        
            },
            nationality:{
                type:String,
                required: true
                
        
            },

        }
    ],



    

    
    //social media link fields
    social: 
        {
           
            twitter:{
                type:String,
               
        
            },
            facebook:{
                type:String,
                
        
            },
            
            instragram:{
                type:String,
                
        
            },
        },

            date: {
                type : Date,
                default: Date.now

            }
          
    

});


module.exports = Profile = mongoose.model('profile',ProfileSchema);