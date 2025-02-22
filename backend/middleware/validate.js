// File Path: middleware/validate.js

function Validate(req,res,next){
    try{
    let error=validationResult(req);
    if(!error.isEmpty()){
    return res.status(422).json(error.array());
    }
    next();
    }catch(e){
    console.log(e.message);
    res.send(e.message);
    }
    }
    
    module.exports=Validate;
    