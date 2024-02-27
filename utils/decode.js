const jwt=require('jsonwebtoken')

exports.decode_jwt=(req,res,next)=>{
        const auth_header = req.headers['authorization'];
        const len=auth_header.split(' ').length;
        if(len<2){
            next(new Error("please provide token"));
        }
        const access_token=auth_header.split(' ')[1];
        const decoded_access_token=jwt.decode(access_token);
        if(decoded_access_token){
            res.locals.id=decoded_access_token.id;
            next();
        }
        else{
            res.locals.id=null;
            next();
        }
    }
