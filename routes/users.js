const express=require('express')
const route=express.Router();
const user_controller=require('../controller/user_control')
const decode=require('../utils/decode')
const { celebrate ,Joi} = require("celebrate");

route.post('/',celebrate({
    body:Joi.object({
        username:Joi.string().min(3).max(30),
        mail:Joi.string().email().min(5).max(50).required(),
        password:Joi.string().min(8).max(30).required(),
        confirm_password:Joi.string().valid(Joi.ref("password")).required(),
        mobile:Joi.number().optional(),
    })
}),user_controller.signup);


route.post('/login',celebrate({
    body:Joi.object({
        mail:Joi.string().email().min(5).max(50).required(),
        password:Joi.string().min(8).max(30).required(),
    })
}),user_controller.login);


route.put('/',celebrate({
    headers: Joi.object({
        authorization: Joi.string().required(),
      }).unknown(true) ,    //This unknown(true) will set all the other headers as optional except for the ones which is mentioned inside the Joi.objects
    body:Joi.object({
        username:Joi.string().min(3).max(30).optional(),
        mail:Joi.string().email().min(5).max(50).optional(),
        password:Joi.string().min(8).max(30).optional(),
        mobile:Joi.number().optional(),
    })
}),decode.decode_jwt,user_controller.update);



module.exports=route;