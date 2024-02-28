const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const axios = require('axios')
const { user } = require('../models');
const { update_user } = require('../operations/user_operations');

describe('Testing user Update suit', () => {
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

  after(async ()=>{
    await user.destroy({
      where:{},
      truncate:true,
      cascade:true,
    });
  });

    it('proper user with updates', async () => {
        const updated_user = await update_user(1, { mail: "priya@gmail.com" });
        //console.log("%%%%%%%%%%%%%%%%%%%%%%",updated_user);
        await expect(await user.findOne({ where: { mail: "priya@gmail.com", id: 1 } })).to.exist;
        expect(updated_user).to.exist;
        expect(updated_user[1][0].mail).to.be.eq("priya@gmail.com");
    });

    //here there is no invalid user tries to update because if the user is validated only he/she can update the fields

    it('axios with proper updates', async () => {
           const response= await axios({
                method: 'put',
                url:"http://localhost:5000/user",
                data:{
                    username:"priya",
                    mail:"priya@gmail.com",
                },
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzA5MDExOTQ2fQ.LCN7MXnmg_hrQrWemDTzMi6d7hV2hYipZwuL7CJ8NKQ",
                }
              });
            expect(response.data.mail).to.be.eq("priya@gmail.com");
            expect(response.data.username).to.be.eq("priya");
    });
});
