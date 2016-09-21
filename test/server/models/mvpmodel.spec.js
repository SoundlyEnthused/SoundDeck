const chai = require('chai');
const MVP = require('../../../server/models/MVP');

const expect = chai.expect;

/* global xdescribe describe it after afterEach before beforeEach */

xdescribe('MVP Model', () => {
  describe('get', () => {
    it('should be a function', () => {
      expect(MVP.get).to.be.a('function');
    });
    it('should return an object of app state', () => {
      expect(MVP.get()).to.be.an('object');
    });
  });
  describe('reset', () => {
    it('should be a function', () => {
      expect(MVP.reset).to.be.a('function');
    });
    it('should reset state to an empty object', () => {
      MVP.reset();
      expect(MVP.get()).to.deep.equal({});
    });
  });
});
