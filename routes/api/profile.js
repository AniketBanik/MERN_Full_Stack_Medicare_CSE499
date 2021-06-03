const express = require('express');
const request = require('request');
const config = require('config');

const router = express.Router();
const auth = require('../../middleware/auth');
const {check,validationResult} = require('express-validator');



const Profile = require('../../models/Profile');



//@route GET api/profile/me
//@desc Get current users profile
//@access Private
//async is used for making promise that we request and mongoose will repond our req.
router.get('/me', auth , async(req,res)=> 
{
    try{
        const profile =await Profile.findOne({ user: req.user.id}).populate('user', ['name', 'avatar']) ; ////finding and calling profile model declared firstand then info will get by the user id(education,experience etc..)& using populate to bring from user the name and avater array of users.

         //checking there has any profile or not
         if(!profile){
             return res.status(400).json({ msg : 'There is no profile for this user'});
         }

         res.json(profile);

    }catch(err){

        console.error(err.message);
        res.status(500).send('Server Error');


    }
});

//@route POST api/profile
//@desc   Create or update user profile
//@access Private

router.post('/' , [auth,[
    check('location' , 'location is required')
    .not()
    .isEmpty(),
    check('bio' , 'Bio is required')
    .not()
    .isEmpty(),
   
]
],
async (req,res) =>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }

    const{

        location,
        bio,
        facebook,
        twitter,
        instragram,
        
    } = req.body; //pulling out from req.body

    //Build profile object
    const profileFields = {};
    profileFields.user =req.user.id;
   
    if(location) profileFields.location = location;
    if(bio) profileFields.age = bio;
    

    

    //just for checking---console.log(profileFields.skills);  // for array and spacing the skills
    //just for checking---res.send('Hello');

    
    
    //Now,Build social object
    profileFields.social = {}

   

    
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(instragram) profileFields.social.instragram = instragram;


    //just for checking---console.log(profileFields.social.youtube);
    //just for checking-----res.send('Hello');


    //now update and insert the data

    //1) only for find the profile by users and if found then only update possible,if not then 2)create the profile for updating
    try{

        let profile = await Profile.findOne({user: req.user.id});  //finding profile by users



        if(profile){
            //if found then update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id} , 
                { $set: profileFields} ,

                { new :true}

            );

            return res.json(profile); //for finding entire profile


        }


            //2)creating profile if not found the profile by users

            profile = new Profile(profileFields);

            await profile.save();
            res.json(profile); //return the profile



      

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
        
    
    
    }



    




    }



);

//@route GET api/profile
//@desc   Get all profiles
//@access Public
router.get('/' , async (req,res)=>{
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//now copying for get only by user_id not by profile_id and remove 's' from profile

//@route GET api/profile/user/ :user_id
//@desc   Get profile by user ID
//@access Public
router.get('/user/:user_id' , async (req,res)=>{
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']); //fineOne here---- not find

        if(!profile) 
        return res.status(400) .json({msg:'Profile not found!'});
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId') {

            return res.status(400) .json({msg:'Profile not found!'})
        }

        res.status(500).send('Server Error');
    }
});

//copying again for delete user and their all posts/everything

//@route DELETE api/profile
//@desc   Delete profile, user & posts
//@access Private
router.delete('/' , auth , async (req,res)=>   //adding auth coz its private token
{
    try {
        //@todo--- remove user's posts


        // remove profile
        await Profile.findOneAndRemove({ user: req.user.id});

        //remove user
        await User.findOneAndRemove({ _id: req.user.id});


        res.json({msg: 'User deleted'}); //returning delete message
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route PUT api/profile/healthcondition
//@desc   Add profile healthcondition
//@access  Private
router.put('/healthcondition', [auth, [
    check('bloodsugarlevel','BloodSugarLevel is required')
    .not()
    .isEmpty(),

    check('bloodpressure','BloodPressure is required')
    .not()
    .isEmpty(),

    check('bloodgroup','BloodGroup is required')
    .not()
    .isEmpty(),
    check('sufferingfrom','SufferingFrom is required')
    .not()
    .isEmpty(),
    check('howlongsufferingfrom','HowLongSufferingFrom is required')
    .not()
    .isEmpty(),
    check('othercomplications','OtherComplications is required')
    .not()
    .isEmpty(),
    check('spectaclespower','SpectaclesPower is required')
    .not()
    .isEmpty(),
    check('anyallergy','AnyAllergy is required')
    .not()
    .isEmpty(),
    check('anycovid','AnyCovid is required')
    .not()
    .isEmpty(),
    
]
], async(req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400). json ({errors: errors.array()});
    }

    const{
        bloodsugarlevel,
        bloodpressure,
        bloodgroup,
        sufferingfrom,
        howlongsufferingfrom,
        othercomplications,
        spectaclespower,
        anyallergy,
        anycovid
    } =req.body;
    
    const newMedi ={
        bloodsugarlevel,
        bloodpressure,
        bloodgroup,
        sufferingfrom,
        howlongsufferingfrom,
        othercomplications,
        spectaclespower,
        anyallergy,
        anycovid
    }

    try {
        
        const profile = await Profile.findOne({user:req.user.id});

        profile.healthcondition.unshift(newMedi);

        await profile.save();

        res.json(profile); //return the whole profile for front end


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }

   }
);

//@route DELETE api/profile/healthcondition/:exp_id
//@desc   Delete medicalreport from profile
//@access  Private

router.delete('/healthcondition/:medi_id', auth, async(req,res)=>{
    try {
        const profile =await Profile.findOne({user:req.user.id});

        //Get remove index

        const removeIndex = profile.healthcondition.map(item => item.id) 
        .indexOf(req.params.medi_id); //to get experience

        profile.healthcondition.splice(removeIndex,1); //splicing it out

        await profile.save();


        res.json(profile);
        
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
        
    }
});
 // Now, for adding and deleting Education(So copy the put & delete from experience)

 //@route PUT api/profile/patientinformations
//@desc   Add profile patientinformations
//@access  Private
router.put('/patientinformations', [auth, [
    check('name','Name is required')
    .not()
    .isEmpty(),

    check('age','Age is required')
    .not()
    .isEmpty(),

    check('gender',' Gender is required')
    .not()
    .isEmpty(),
    check('permanentaddress',' PermanentAddress is required')
    .not()
    .isEmpty(),
    check('presentaddress',' PresentAddress is required')
    .not()
    .isEmpty(),
    check('emailaddress',' EmailAddress is required')
    .not()
    .isEmpty(),
    check('mobileno',' MobileNo is required')
    .not()
    .isEmpty(),
    check('nidorbirthcirtificateno',' NIDorBirthcirtificateno is required')
    .not()
    .isEmpty(),
    check('nationality',' Nationality is required')
    .not()
    .isEmpty(),
   
]
], async(req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400). json ({errors: errors.array()});
    }

    const{
        name,
        age,
        gender,
        permanentaddress,
        presentaddress,
        emailaddress,
        mobileno,
        nidorbirthcirtificateno,
        nationality
    } =req.body;
    const newInfo ={
        name,
        age,
        gender,
        permanentaddress,
        presentaddress,
        emailaddress,
        mobileno,
        nidorbirthcirtificateno,
        nationality
    }

    try {
        
        const profile = await Profile.findOne({user:req.user.id});

        profile.patientinformations.unshift(newInfo);

        await profile.save();

        res.json(profile); //return the whole profile for front end


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }

   }
);

//@route DELETE api/profile/patientinformations/:info_id
//@desc   Delete patientinformations from profile
//@access  Private

router.delete('/patientinformations/:info_id', auth, async(req,res)=>{
    try {
        const profile =await Profile.findOne({user:req.user.id});

        //Get remove index

        const removeIndex = profile.patientinformations.map(item => item.id) 
        .indexOf(req.params.info_id); //to get personalinformations

        profile.patientinformations.splice(removeIndex,1); //splicing it out

        await profile.save();


        res.json(profile);
        
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
        
    }
})


module.exports = router;