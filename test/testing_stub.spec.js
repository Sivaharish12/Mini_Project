const chai = require('chai');
const expect = chai.expect;
const sinon = require("sinon");
const time=require('../controller/time');

describe('testing external modules', () => {
    beforeEach(() => {
        sinon.stub(time, 'getime').returns('2024-02-24');
    });

    afterEach(() => {
        sinon.restore();
    });


    it('testing stub', () => {
        const result = time.getime();
        expect(result).to.be.equal('2024-02-24');
    });    
});
