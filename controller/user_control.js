const {create_user,verify_user,update_user}=require('../operations/user_operations')
const jwt=require('jsonwebtoken');
const { Error } = require('sequelize');

exports.signup=async (req,res,next)=>{
    try{
        const{username,mail,password,confirm_password,mobile}=req.body;
        const user=await create_user(username,mail,password,confirm_password,mobile);
        res.send(user);
    }
    catch(err){
        next(new Error(err));
    } 
}

exports.login=async(req,res,next)=>{
    try{
        const{mail,password}=req.body;
        const user=await verify_user(mail,password);
        const access_token=jwt.sign({id:user.id},process.env.ACCESS_TOKEN_SECRET);
        const refresh_token=jwt.sign({id:user.id},process.env.REFRESH_TOKEN_SECRET);
        res.json({access_token:access_token,refresh_token:refresh_token});
    }catch(err){
        next(new Error(err));
    }
}


exports.update=async(req,res)=>{
    const id=res.locals.id,body=req.body;
    const updated_user=await update_user(id,body);
    res.send(updated_user[1][0]); 
}

