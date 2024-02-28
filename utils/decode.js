const jwt=require('jsonwebtoken')

exports.decode_jwt=(req,res,next)=>{
        const auth_header = req.headers['authorization'];
        const len=auth_header.split(' ').length;
        if(len<2){
            next(new Error("please provide token"));
        }
        const access_token=auth_header.split(' ')[1];
        jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.locals.id = null;
                console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",err);
                next();
            }
            res.locals.id = decoded.id;
            next();
        });
    }
