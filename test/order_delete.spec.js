const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
chai.should();
const {delete_order}=require('../operations/order_operations')
const { order ,product,user} = require('../models'); 

describe('Order delete Test Suit', () => {
    before(async function(){
            await product.create({
                id:1,
                product_name:"iphone",
                quantity:50,
                price:120000
            });
            await user.create({
                id:1,
                username:"hari",
                mail:"harishsiva24112002@gmail",
                password:'12345678',
                confirm_password_password:'12345678',
                mobile:123456
            });
            await order.create({
            id: 3,
            user_id: 1,
            product_id: 1,
            quantity: 10,
            name: 'iphone',
            price: 120000
            });   
            await product.update(
            { quantity: 40 },
            { where: { id: 1 } }
            );
    });


    after(async ()=>{
            await product.destroy({ where: {}, 
                truncate: true, 
                cascade: true,  
            });

            await order.destroy({ where: {}, 
                truncate: true, 
                cascade: true,  
            });

            await user.destroy({ where: {}, 
                truncate: true, 
                cascade: true, 
            });
    })

    it('deleting not a valid order',async () => {
        const order_id=4;
        delete_order(order_id).should.eventually.be.rejectedWith("There is no order to delete");
    });

    it('should delete a valid orders',async () => {
        const order_id=3;
        const order_del=await delete_order(order_id);
        const product_count=await product.findOne({where:{id:1}})
        console.log(product_count);
        expect(product_count.quantity).to.be.equal(50) //check if the updation works fine after deleting an order
        order.findOne({where:{id:order_id}}).should.eventually.be.eq(null);  
        expect(order_del).to.eq(order_id);
    });
        
});
