const chai=require('chai')
const test=require('../controller/testing_callback_promises')
const expect=chai.expect

describe('testing prmoise', () => {
    it('testing promise with async/await',async () => {
        const value=await test();
        expect(value).to.be.true;
    }).timeout(6000);

    it('testing promise with the .then method', () => {
        return test().then((value)=>{
            expect(value).to.be.true;
        });
    }).timeout(6000);
    
    
});
