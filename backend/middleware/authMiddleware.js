// File Path: middleware/authMiddleware.js

const jwt = require ('jsonwebtoken');
require ('dotenv') .config ();

const authMiddleware = async (req,res,next)=>{
try{
let token=req.header ('Authorization') .replace ('Bearer ','');

if(!token)return res.status(401).json ({message:'Access denied.No token provided.'});

const decodedToken=jwt.verify(token ,process.env.JWT_SECRET );

req.user=decodedToken;

next();
}catch(error){
console.error(error);
res.status(400).json ({message:'Invalid Token'});
}
}

module.exports=authMiddleware;
