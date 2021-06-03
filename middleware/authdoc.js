const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = function(req, res , next){
    //Get the token from header
    const token = req.header('y-auth-token');

    //check if not token
    if(!token){
        return res.status(401).json({msg: 'No token, authorization denied for doctors'});
    }



    //Verify token
    try{
        const decoded = jwt.verify(token, config.get('jwtSecret1'));

    

        req.doc = decoded.doc;
        next();

    } catch(err){
        res.status(401).json({msg: 'Token is not valid for doctor'});



    }
}