const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
chai.should();
const jwt=require('jsonwebtoken');
const decode=require('../utils/decode');

describe('Testing decode JWT token', () => {
    it('correct token', (done) => {
        const req = {
           headers: {
              authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTEsImlhdCI6MTcwOTE3Nzc1NSwiZXhwIjoxNzA5MTc4NjU1fQ.aVgCRn3PIgOtjMbjypI74kidmM7Rr1ds3HrOpQvR2Ng"
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

     it('token with expired time', (done) => {
      console.log(process.env.ACCESS_TOKEN_SECRET);
      const expiredToken = jwt.sign({ id: 1 }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1s' });
      const req = {
          headers: {
              authorization: `Bearer ${expiredToken}`
          }
      };
      const res = {
          locals: {}
      };

      setTimeout(() => {
          decode.decode_jwt(req, res, (error) => {
              expect(error.message).to.be.eq("JWT token has expired");
              done();
          });
      }, 1000); // Wait for 1 second to ensure token is expired
  });
     
     
    
});
