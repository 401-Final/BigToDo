const Context = require('../../lib/models/context');
const expect = require('chai').expect;

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const userId = new mongoose.Types.ObjectId();

describe ('Context model', () => {

  it ('validates with name and user', (done) => {
    const test_context = new Context({
      name: 'Home',
      user: userId
    });

    test_context.validate((err) => {
      done(err);
    });
  });

  it ('name is required', (done) => {
    const test_context = new Context({
      user: userId
    });

    test_context.validate((err) => {
      if (!err) done('name should have been required');
      expect(err).to.be.ok;
      done();
    });
  });

  it ('user is required', (done) => {
    const test_context = new Context({
      name: 'Do this task'
    });

    test_context.validate((err) => {
      if (!err) done('user should have been required');
      expect(err).to.be.ok;
      done();
    });
  });

});