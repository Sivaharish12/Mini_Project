const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const {create_order}=require('../operations/order_operations')
chai.use(chaiAsPromised);
const expect = chai.expect;
chai.should();
const {user,product,order}=require('../models')


describe('order creation suit', () => {
        before(async ()=>{
                await product.create({
                        id:1,
                        product_name:"iphone",
                        quantity:50,
                        price:120000
                });

                await user.create({
                        id:1,
                        username:"hari",
                        mail:"harishsiva24112002@gmail.com",
                        password:'12345678',
                        mobile:123456
                });
        });

        after(async ()=>{
                await user.destroy({ where: {}, 
                        truncate: true, 
                        cascade: true, 
                });

                await product.destroy({ where: {}, // Empty conditions to delete all records
                truncate: true, // Truncate the table
                cascade: true, // Cascade delete for related records 
                });

                await order.destroy({ where: {}, 
                truncate: true, 
                cascade: true,  
                }); 
        });

        it('with not available product', async () => {
                const product_id = 100; //product_id 100 is not available
                const quantity = 10;
                const user_id=1;
                product.findByPk(product_id).should.eventually.be.null; // null means the product is not available
                create_order(product_id,quantity,user_id).should.eventually.be.rejectedWith(`insert or update on table "orders" violates foreign key constraint "orders_product_id_fkey"`); // Replace with your actual error message
                 });
            
        
        // const product_id=1,quantity=100,user_id=1;
        it('with existed product but with higher quantities than present in the product quantity', () => create_order(1,100,1).should.eventually.be.rejectedWith("The product quantity is less than the demand quantity"));
        

        it('order creation with existing product within available quantity',async () => {
            const before_order_creation_product_count=50;
            const orders=await create_order(1,10,1);
            const after_product_quantity=before_order_creation_product_count-10
            expect(after_product_quantity).to.be.eq(40)
            expect(orders).exist;
            expect(orders.quantity).to.be.eq(10);
        });    
    
});
