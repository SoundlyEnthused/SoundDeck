const chai = require('chai');
const User = require('../../../server/models/User');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);

// username avatar_url
/* globals describe it */
describe('User', () => {
  describe('create', () => {
    it('should be a function', () => {
      expect(User.create).to.be.a('function');
    });
    it('should return a user object for a given soundcloud id, username, avatar_url', () => {
      const user = User.create(12, 'coolguy', 'http://www.example.com/avatar.gif');
      expect(user).to.eventually.be.an('object');
    });
  });
  describe('get', () => {
    it('should be a function', () => {
      expect(User.get).to.be.a('function');
    });
    it('should return a user for a given user', () => {
      const id = 12;
      User.create(id, 'coolguy', 'http://www.example.com/avatar.gif');
      expect(User.get(id)).to.eventually.be.an('object');
      expect(User.get(id)).to.eventually.deep.equal({ id, username: 'coolguy', avatar_url: 'http://www.example.com/avatar.gif' });
    });
    it('should return null if there is no user for a given id', () => {
      expect(User.get(1234)).to.eventually.equal(null);
    });
  });
});
