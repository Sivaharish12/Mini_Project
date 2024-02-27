const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const axios=require('axios');
const {verify_user}=require('../operations/user_operations');
const sinon=require('sinon');
const jwt=require('jsonwebtoken');
const proxyquire=require('proxyquire');
const{user}=require('../models')

describe('Testing Login Suit', () => {
  let proxiedLogin;

  before(async ()=>{
    await user.create({
      id:1,
      username:"hari",
      mail:"harishsiva24112002@gmail.com",
      password:'12345678',
      confirm_password_password:'12345678',
      mobile:123456
    });
  });

  beforeEach(async ()=>{
      const signStub=sinon.stub(jwt,'sign').returns("sfvnofnoifnqfdnuiundnondoNFDOIWFNOUIFNOFOICASJCJASnsncnoofnfnqf");
      const userControlProxy =await proxyquire('../controller/user_control', {
        'jsonwebtoken': {
            sign: signStub
        }
      });
    //console.log(userControlProxy.login);
    proxiedLogin = userControlProxy.login;   // Assign the stunned login function in the proxiedLogin.
  });

  after(async ()=>{
    await user.destroy({
      where:{},
      truncate:true,
      cascade:true
    });
  });

  afterEach(()=>{
      sinon.restore();
  })

    it('testing proper user',async () => {
        const user=await verify_user("harishsiva24112002@gmail.com","12345678")
        expect(user).exist;
    });
    
    it('invalid mail',async () => {
      await expect(verify_user("couifuefuq@gmail.com","123r836r839tr")).to.be.rejectedWith("The user is not valid")
    });

    it("invalid password",async ()=>{
      await expect(verify_user("harishsiva24112002@gmail.com","h9ugfu9egu9f")).to.be.rejectedWith("The user is not valid")
    })


  it('Should authenticate a user', async () => {
        const credentials = {
            mail: 'harishsiva24112002@gmail.com',
            password: '12345678'
        };
  
        await proxiedLogin({ body: credentials }, {
          json: (data) => {
              expect(data).to.have.property('access_token');
              expect(data.access_token).to.be.eq("sfvnofnoifnqfdnuiundnondoNFDOIWFNOUIFNOFOICASJCJASnsncnoofnfnqf");
              expect(data).to.have.property('refresh_token');
              expect(data.refresh_token).to.be.eq("sfvnofnoifnqfdnuiundnondoNFDOIWFNOUIFNOFOICASJCJASnsncnoofnfnqf")
          }
      }, (err) => {
          if (err) {
              console.error('Error during login:', err);
          }
         });
      const tokens=await axios.post("http://localhost:5000/user/login",credentials)
      console.log(tokens.data);
  });

});
