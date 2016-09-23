const chai = require('chai');
const User = require('../../../server/models/User');

const expect = chai.expect;
// username avatar_url
/* globals describe it */
describe('User', () => {
  describe('create', () => {
    it('should be a function', () => {
      expect(User.create).to.be.a('function');
    });
    it('should return a user object for a given soundcloud id, username, avatar_url', () => {
      const user = User.create(12, 'coolguy', 'http://www.example.com/avatar.gif');
      expect(user).to.be.an('object');
    });
  });
  describe('get', () => {
    it('should be a function', () => {
      expect(User.get).to.be.a('function');
    });
    it('should return a user for a given user', () => {
      const id = 12;
      User.create(id, 'coolguy', 'http://www.example.com/avatar.gif');
      expect(User.get(id)).to.be.an('object');
      expect(User.get(id)).to.deep.equal({ id, username: 'coolguy', avatar_url: 'http://www.example.com/avatar.gif' });
    });
  });
});
