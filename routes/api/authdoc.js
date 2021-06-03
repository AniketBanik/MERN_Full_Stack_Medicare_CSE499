const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authdoc = require('../../middleware/authdoc');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult} = require('express-validator');



const Doc = require('../../models/doc');





//@route api/auth

//@route  api/auth
//@desc Test route
//@access public

router.get('/', authdoc , async(req,res)=> {
    try{
        const doc = await  Doc.findById(req.doc.id).select('-password');
        res.json(doc);


    } catch(err){

        console.error(err.message);
        res.status(500).send('Server Error');

    }
} );                                                //res.send('Auth route'))here;


//from doc.js copy

//@route POST api/auth
//@desc Authenticate doc & get token
//@access public

router.post('/',[
   
    check('mobileno','please include a valid mobile number').isMobilePhone(),
    check('password',  'Password is required').exists()
],
async(req,res)=> { 
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});//400 bad request
    }

    const {mobileno,password} = req.body;

    try{
        //Workflow:1)see if doctors exists
        let doc=await Doc.findOne({mobileno});


         if(!doc){
            return res
            .status(400)
            .json( {errors:[{msg:'Invalid Credentials' }]  });
         } 

         const isMatch = await bcrypt.compare(password, doc.password);
         
         if(!isMatch){
            return res
            .status(400)
            .json( {errors:[{msg:'Invalid Credentials' }]  });
         }



const payload={
       doc : {
           id:doc.id
       }
   };


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