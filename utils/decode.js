require('dotenv').config();
const jwt=require('jsonwebtoken');

exports.decode_jwt=(req,res,next)=>{
        const auth_header = req.headers['authorization'];
        const len=auth_header.split(' ').length;
        if(len<2){
            const missingTokenError = new Error("Please provide a token");
            missingTokenError.status = 401; // Unauthorized
            return next(missingTokenError);
        }
        const access_token=auth_header.split(' ')[1];

        jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    const tokenExpiredError = new Error("JWT token has expired");
                    tokenExpiredError.status = 401; // Unauthorized
                    return next(tokenExpiredError);
                }
                res.locals.id = null;
                //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",err);
                return next();
            }
            //console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",decoded);
            res.locals.id = decoded.id;
            next();
        });
    }
