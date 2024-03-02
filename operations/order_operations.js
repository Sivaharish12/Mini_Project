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
        if (err.message === "The Product is not present") {
            err.status = 404; // Not Found
        }
        throw err;
    }
}



async function get_order(user_id){

    try {                    
        console.log(user_id);                   //it is used to know about the mixins which are available in the sequqlize
        const users = await user.findByPk(user_id);
        if (!users) {
            const userNotFoundError = new Error("The user is not valid");
            userNotFoundError.status = 404; // Not Found
            throw userNotFoundError;
        }
        const orders = await users.getOrders();
        return orders;
    } catch (err) {
        console.log(err);
            throw err;
    }
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



    async function update_order(user_id, product_id, quantity) {
        try {
            const existing_product = await product.findOne({ where: { id: product_id } });
    
            if (!existing_product) {
                const productNotFoundError = new Error("There is no product");
                productNotFoundError.status = 404; // Not Found
                throw productNotFoundError;
            }
    
            const product_quantity = existing_product.quantity;
    
            const existing_order = await order.findOne({
                where: {
                    user_id: user_id,
                    product_id: product_id
                },
            });
    
            if (existing_order) {
                const previous_quantity = existing_order.quantity;
    
                if (quantity < existing_order.quantity) {
                    const updated_order = await existing_order.update({
                        quantity: quantity,
                        price: existing_product.price * quantity
                    });
    
                    await product.update(
                        { quantity: product_quantity + (previous_quantity - quantity) },
                        { where: { id: product_id } }
                    );
                    return updated_order;
                } else {
                    if (quantity + existing_order.quantity > existing_product.quantity) {
                        const quantityExceedError = new Error("The Product Quantity is less than your order, so please reduce the quantity");
                        quantityExceedError.status = 400; // Bad Request
                        throw quantityExceedError;
                    }
    
                    const updated_order = await existing_order.update({
                        quantity: quantity,
                        price: existing_product.price * quantity
                    });
    
                    await product.update(
                        { quantity: product_quantity + (previous_quantity - quantity) },
                        { where: { id: product_id } }
                    );
                    return updated_order;
                }
            } else {
                const orderNotFoundError = new Error("This Order is not present");
                orderNotFoundError.status = 404; // Not Found
                throw orderNotFoundError;
            }
    
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    

    async function delete_order(order_id,user_id) {
        const transaction = await sequelize.transaction();

        try {
            // Find the order with the specified order_id and user_id
            const order_to_delete = await order.findOne({
                where: {
                    id: order_id,
                    user_id: user_id
                },
                include: product,
                transaction,
            });
            
            if (!order_to_delete) {
                await transaction.rollback();
    
                const orderNotFoundError = new Error("There is no order to delete");
                orderNotFoundError.status = 404; // Not Found
                throw orderNotFoundError;
            }
    
            const product_id = order_to_delete.product.id;
            const quantity_restore = order_to_delete.quantity;
    
            await order.destroy({
                where: { id: order_id },
                transaction
            });
    
            await product.update({
                quantity: sequelize.literal(`quantity+${quantity_restore}`)
            },
            { where: { id: product_id }, transaction });
    
            await transaction.commit();
            return order_id;
        } catch (err) {
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
            throw err;
        }
    }
    

module.exports={create_order,get_order,update_order,delete_order}