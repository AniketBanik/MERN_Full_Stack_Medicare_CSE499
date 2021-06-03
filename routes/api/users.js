const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult} = require('express-validator');


const User = require('../../models/user');

//@route POST api/users
//@desc Register user
//@access public

router.post('/',[
    check('name', 'name is required')
    .not()
    .isEmpty(),

    check('email','please include a valid email').isEmail(),

    check('mobileno','please include a valid mobile number').isMobilePhone(),

    

    check('age','Age is required') 
    .not()
    .isEmpty(),

    check('password','Please enter a password with 6 or more characters')
    .isLength({min:6})
],
async(req,res)=> { 
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});//400 bad request
    }

    const {name,email,mobileno,age,password} = req.body;

    try{
        //Workflow:1)see if user exists
        let user=await User.findOne({email});
         if(user){
            return res.status(400).json( {errors:[{msg:'User already exists' }]  });
         } 


       //2)Get users gravatar
       const avatar = gravatar.url(email,{
         s: '200',
         r: 'pg',
         d: 'mm'

       })

       user =new User({
           name,
           email,
           avatar,
           mobileno,
           
           age,
           password
       });

   //3)Encrypt password using bcrypt
   const salt = await bcrypt.genSalt(10);
   user.password=await bcrypt.hash(password,salt);
   await user.save();

   //4)Return jsonwebtoken
   const payload={
       user : {
           id:user.id
       }
   }
   jwt.sign(
       payload, 
    config.get('jwtSecret'),
    {expiresIn : 360000},
    (err , token)=>{
        if(err) throw err;
        res.json({ token});
    }
    );

   
   
   
    //res.send('User registered'); Its without webtoken in register




    }catch(err){

        console.error(err.message);
        res.status(500).send('Server error');

    }


    

    
   

   

   
}
);


module.exports = router;