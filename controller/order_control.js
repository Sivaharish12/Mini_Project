const{create_order,get_order,update_order,delete_order}=require('../operations/order_operations')

exports.createOrder=async (req,res,next)=>{
  try{
    const{product_id,quantity}=req.body;
    const user_id=res.locals.id;
    const neworder=await create_order(product_id,quantity,user_id)
    res.send(neworder);
  }
  catch(err){
    next(new Error(err))
  }
 
}

exports.getorders=async (req,res,next)=>{
  try{
    const userId=res.locals.id;
    const orders=await get_order(userId)
    console.log(orders);
    res.send(orders)
  }
  catch(err){
    next(err)
  }
}

exports.update_orders=async (req,res,next)=>{
  try{
    const user_id=res.locals.id;
    const product_id=req.params.id;
    const {quantity}=req.body;
    const updated_order=await update_order(user_id,product_id,quantity);
    res.send(updated_order);
  }
  catch(err){
    next(err)
  }

}

exports.delete_orders=async (req,res,next)=>{
  try{
    const order_id=req.params.id;
    const deleted_order=await delete_order(order_id);
    res.send(`The order with ${deleted_order} is deleted`)
  }
  catch(err){
    next(err)
  }
}