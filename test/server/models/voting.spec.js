const chai = require('chai');
const Voting = require('../../../server/models/Voting');

const expect = chai.expect;

describe('Voting', () => {
    afterEach('reset models', () => {
    Room.clearAll();
  });

  describe('create', () => {
    it('should be a function', () => {
      expect(Voting.create).to.be.a('function');
    });

  });

  describe('upvotes', () => {
    it('should give the current DJ a like', () => {
      // fake likes = 0
      // call the upvote funciton
      // expect fakeDJ.likes = 1
    });
    it('a user can only vote once per song', () => {

    });
  });
  describe('Downvotes', () => {
    it('should give the current song a dislike', () => {

    });
    it('should skip the song if there are X% of people dislike the song', () => {

    });
    it('kick out the DJ if too many downvotes?', () => {

    });
  });
});
