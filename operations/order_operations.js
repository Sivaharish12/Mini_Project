const { order, product, user } = require('../models'); 
const db=require('../models/index');
const sequelize=db.sequelize;


async function create_order(product_id, quantity, user_id) {
    let transaction;

    try {

        transaction = await sequelize.transaction();
        const existedProduct = await product.findByPk(product_id, { transaction });
        if (!existedProduct) {
            throw new Error("The Product is not present");
        }

        if (existedProduct.quantity < quantity) {
            throw new Error("The product quantity is less than the demand quantity");
        }

        const newOrder = await order.create({
            user_id: user_id,
            product_id: product_id,
            quantity: quantity,
            name: existedProduct.name,
            price: existedProduct.price * quantity
        }, { transaction });

        await product.update(
            { quantity: existedProduct.quantity - quantity },
            { where: { id: product_id }, transaction }
        );
        await transaction.commit();
        return newOrder;
    } catch (err) {
        if (transaction) await transaction.rollback();
        throw err;
    }
}



async function get_order(user_id){

    try {                    
        console.log(user_id);                   //it is used to know about the mixins which are available in the sequqlize
        const users = await user.findByPk(user_id);
        if (!users) {
            throw new Error("The user is not valid");
        }
    
        const orders = await users.getOrders();
        return orders;
    } catch (err) {
        console.log(err);
            throw err;
    }
    
    // try{      //But it efficient than the mixins because it uses the joins so it is calling DB only once but in the mmixins it 
               //// calls the user DB and then it calls the order DB so totally there are two DB calls 
    //     const orders=await user.findByPk(user_id,{
    //         include:{
    //             model:order
    //         }
    //     })
    //     return orders.orders;
    // }
    // catch(err){
    //     throw new Error("The user is not valid");
    // } 
}



async function update_order(user_id,product_id,quantity){
    try{
        //console.log(`THe user id is ${user_id} and the product id is ${product_id} %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
        const existing_product=await product.findOne({where:{id:product_id}});
        console.log(existing_product);
        if(!existing_product){
            throw new Error("There is no product")
        }
        const product_quantity=existing_product.quantity;
        const existing_order=await order.findOne({
             where:{
                user_id:user_id,
                product_id:product_id
            },
        });
        //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",existing_order);
        if(existing_order){
        const previous_quantity=existing_order.quantity;
        //console.log(existing_order);
            if(quantity<existing_order.quantity){
               
                const updated_order=await existing_order.update({
                    quantity:quantity,
                    price:existing_product.price*quantity
                });
                
                await product.update(
                    {quantity:product_quantity+(previous_quantity-quantity)},
                    {where:{id:product_id}}
                    );
                return updated_order
            }
            else {
                if(quantity+existing_order.quantity>existing_product.quantity){
                    throw new Error("The Product Quantity is less than your order so please reduce the quantity")
                }
                console.log(`exis ${previous_quantity}`);
                const updated_order=await existing_order.update({
                    quantity:quantity,
                    price:existing_product.price*quantity
                });
                console.log(product_quantity+(previous_quantity-quantity));
                await product.update(
                    {quantity:product_quantity+(previous_quantity-quantity)},
                    {where:{id:product_id}}
                    );
                return updated_order
            }
        }
        else{
            throw new Error("This Oder is not present ")
        }

    }
    catch (err){
        console.log(err);
        throw err
    }
     

}


async function delete_order(order_id){
    const transaction=await sequelize.transaction();
    try{
        const order_to_delete=await order.findByPk(order_id,{
            include:product,
            transaction,
        });

        if(!order_to_delete){
            await transaction.rollback();
            throw new Error("There is no order to delete");
        }
        const product_id=order_to_delete.product.id;
        const quantity_restore=order_to_delete.quantity;
        await order.destroy({
            where:{id:order_id},
            transaction
        });
        await product.update({
            quantity:sequelize.literal(`quantity+${quantity_restore}`)
        },
        {where:{id:product_id},transaction});
        await transaction.commit();
        return order_id
    }
    catch(err){
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        throw err;
    }
}

module.exports={create_order,get_order,update_order,delete_order}