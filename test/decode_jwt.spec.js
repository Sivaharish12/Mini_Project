const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
chai.should();
const decode=require('../utils/decode');

describe('Testing decode JWT token', () => {
    it('correct token', (done) => {
        const req = {
           headers: {
              authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzA5MDI0MjgxfQ.Cnm9PsL3pusCrBxVeK2XyeUDdLi8ocNi1HgHPmzQ2OU"
           }
        };
        const res = {
           locals: {}
        };
     
        decode.decode_jwt(req, res, done)
        expect(res.locals.id).to.be.eq(1);
     });

     it('without token', (done) => {
        const req = {
            headers: {
               authorization: "Bearer"
            }
         };
         const res = {
            locals: {}
         };

        decode.decode_jwt(req, res,(error) => {
            expect(error.message).be.eq("please provide token");
            done();
         });
        
     });

     it('invalid token', () => {
        const req = {
            headers: {
               authorization: "Bearer ujguigiy"
            }
         };
         const res = {
            locals: {}
         };

        decode.decode_jwt(req, res,() => {});
        expect(res.locals.id).to.be.eq(null);
        
     });
     
     
    
});
