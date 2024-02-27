const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);
chai.should();
const{user,order,product}=require('../models');
const {get_order}=require('../operations/order_operations');

describe("Get Order Test  Suit",()=>{
    before(async ()=>{
        await user.create({
            id:1,
            username:"hari",
            mail:"harishsiva24112002@gmail",
            password:'12345678',
            confirm_password_password:'12345678',
            mobile:123456
        });
        await product.create({
            id:1,
            product_name:"iphone",
            quantity:50,
            price:120000
        });
        await order.create({
            user_id:1,
            product_id:1,
            quantity:10,
            name:"iphone",
            price:120000
        });
        await product.update(
            { quantity: 40 },
            { where: { id: 1 } }
        );
    });


    after(async ()=>{
            await order.destroy({ where: {}, 
                truncate: true, 
                cascade: true,  
            });

            await product.destroy({ where: {}, 
                truncate: true, 
                cascade: true,  
            });

            await user.destroy({ where: {}, 
                truncate: true, 
                cascade: true, 
            });
    });

    it("testing the get order with proper existing user",async ()=>{
        const user_id=1;
        const orders=await get_order(user_id);
        expect(orders).exist;
    })

    it('testing with non existing user',() => {
            const user_id=100
            get_order(user_id).should.eventually.be.rejectedWith("The user is not valid");
    });
    
});