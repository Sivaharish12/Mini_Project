const express=require('express')
const route=express.Router();
const decode=require('../utils/decode')
const order_controller=require('../controller/order_control')
const { celebrate ,Joi} = require("celebrate");


route.post('/',celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true) ,
  body:Joi.object({
      product_id:Joi.number().required(),
      quantity:Joi.number().required()
  })
}),decode.decode_jwt,order_controller.createOrder);


route.get('/',celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true)
}),decode.decode_jwt,order_controller.getorders);


route.put('/:id',celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true) ,
  body:Joi.object({
    quantity:Joi.number().required()
})
}),decode.decode_jwt,order_controller.update_orders);



route.delete('/:id',celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true) 
 }),decode.decode_jwt,order_controller.delete_orders);

module.exports=route;

