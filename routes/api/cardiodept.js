const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authdoc = require('../../middleware/authdoc');
const auth = require('../../middleware/auth');

const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult} = require('express-validator');

const Doc = require('../../models/doc');

const User = require('../../models/user');

router.get('/', auth , async(req,res)=>{

    try{
        const doc = await  Doc.find(req.doc.department);
        res.json(doc);


    } catch(err){

        console.error(err.message);
        res.status(500).send('Server Error');

    }


    //for token verify

    const {mobileno,password} = req.body;

    try{
        //Workflow:1)see if user exists
        let user=await User.findOne({mobileno});


         if(!user){
            return res
            .status(400)
            .json( {errors:[{msg:'Invalid Credentials' }]  });
         } 

         const isMatch = await bcrypt.compare(password, user.password);
         
         if(!isMatch){
            return res
            .status(400)
            .json( {errors:[{msg:'Invalid Credentials' }]  });
         }

 const payload={
       user : {
           id:user.id
       }
   };


   jwt.sign(
       payload, 
    config.get('jwtSecret'),
    {expiresIn : 360000},
    (err , token)=>{
        if(err) throw err;
        res.json({ token});
    }
    );

   
}catch(err){

        console.error(err.message);
        res.status(500).send('Server error');

    }

    
}


);


module.exports = router;