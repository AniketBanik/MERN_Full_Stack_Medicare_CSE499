const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult} = require('express-validator');


const Doc = require('../../models/doc');

//@route POST api/users
//@desc Register user
//@access public

router.post('/',[
    check('name', 'name is required')
    .not()
    .isEmpty(),

    check('email','please include a valid email').isEmail(),

    check('mobileno','please include a valid mobile number').isMobilePhone(),

    check('department','please include a valid department') 
    .not()  
    .isEmpty(),

    check('gender','Gender is required')
    .not()
    .isEmpty(),

    check('age','Age is required') 
    .not()
    .isEmpty(),
    check('degree','Degree is required') 
    .not()
    .isEmpty(),
    check('medicalcollege','Medical College is required') 
    .not()
    .isEmpty(),
    check('visit','Visit is required') 
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

    const {name,email,mobileno,department,gender,age,degree,medicalcollege,visit,password} = req.body;

    try{
        //Workflow:1)see if user exists
        let doc=await Doc.findOne({email});
         if(doc){
            return res.status(400).json( {errors:[{msg:'Doctor already exists' }]  });
         } 


       //2)Get users gravatar
       const avatar = gravatar.url(email,{
         s: '200',
         r: 'pg',
         d: 'mm'

       })

       doc =new Doc({
        name,
        email,
        avatar,
        mobileno,
        department,
        gender,
        age,
        degree,
        medicalcollege,
        visit,
        password
       });

   //3)Encrypt password using bcrypt
   const salt = await bcrypt.genSalt(10);
   doc.password=await bcrypt.hash(password,salt);
   await doc.save();

   //4)Return jsonwebtoken
   const payload={
       doc : {
           id:doc.id
       }
   }
   jwt.sign(
       payload, 
    config.get('jwtSecret1'),
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