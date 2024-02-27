const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;
const {create_user}=require('../operations/user_operations')
const axios=require('axios')
const{order,product,user}=require('../models');

describe('Testing Create User Suit', () => {
    after(async ()=>{
        await user.destroy({ where: {}, 
            truncate: true, 
            cascade: true, 
        });
    });

    it('valid user details',async () => {
        const user=await create_user("hari","harishsiva24112002@gmail.com","12345678","12345678",123456);
        expect(user).to.exist;
        expect(user.username).to.equal("hari");
        expect(user.mail).to.equal("harishsiva24112002@gmail.com");
        expect(user.password).to.equal("12345678");
        expect(user.confirm_password).to.equal("12345678");
        expect(user.mobile).to.equal(123456)
    });

    it('added some other fields to get error', async () => {
        create_user("hari","harishsiva24112002@gmail.com","12345678","12345678","ciabcbuoaeb").should.eventually.be.rejectedWith("The datatype provided is not valid");
    });
    
    it('Should authenticate a user', async () => {
        const credentials = {
            username:"hrp",
            mail: 'harishsiva24112002@gmail.com',
            password: '12345678',
            confirm_password:'12345678',
            mobile:123456
        };
        const response = await axios.post(`http://localhost:5000/user`, credentials);
        expect(response.data).exist;
        expect(response.data.username).to.be.eq('hrp'),
        expect(response.data.mail).to.be.eq('harishsiva24112002@gmail.com'),
        expect(response.data.password).to.be.eq('12345678'),
        expect(response.data.confirm_password).to.be.eq('12345678'),
        expect(response.data.mobile).to.be.eq(123456)

  });

  it('Sholud throw error',async () => {
    const credentials = {
        username:"hrp",
        mail: 'harishsiva24112002@gmail.com',
        password: '12345678',
        confirm_password:'12345678',
        mobile:"advvadbaebaoi"
    };
    const response = await axios.post(`http://localhost:5000/user`, credentials);
    expect(response.data).to.be.eq(`"mobile" must be a number`)
});
  
    
});
