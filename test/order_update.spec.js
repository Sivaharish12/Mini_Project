const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;
const{order,product,user}=require('../models');
const {update_order}=require('../operations/order_operations');

describe("Order Update Test Suit",()=>{

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
        await product.create({
            id:2,
            product_name:"macbook",
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

        // const user_id=1,product_id=100,quantity=1;
    it("Invalid Product Id",async ()=> update_order(1,100,1).should.eventually.be.rejectedWith("There is no product"));

    it("updating quantity greater than the previous order quantity",async ()=>{
        const user_id=1,product_id=1,quantity=6;
        const order=await update_order(user_id,product_id,quantity);
        expect(order).exist;
        expect(order.quantity).to.be.equal(quantity);
    });
    
    it('updating the order which is not present',() =>update_order(1,2,1).should.eventually.be.rejectedWith("This Oder is not present"));
    
    it("updating quantity lesser than the previous order quantity",async ()=>{
        const user_id=1,product_id=1,quantity=2;
        const order=await update_order(user_id,product_id,quantity);
        expect(order).exist;
        expect(order.quantity).to.be.equal(quantity);
    });

    it("updating the quantity which is equal to the previous order quantity",async ()=>{
        const user_id=1,product_id=1,quantity=2;
        const order=await update_order(user_id,product_id,quantity);
        expect(order).exist;
        expect(order.quantity).to.be.equal(quantity);
    });

    it("updating the quantity which is greater than the available than the quantity in the products ",async ()=>{
            const user_id=1,product_id=1,quantity=100;
            update_order(user_id,product_id,quantity).should.eventually.be.rejectedWith("The Product Quantity is less than your order so please reduce the quantity");
    });

});