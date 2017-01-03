const User = require('../lib/models/user');
const expect = require('chai').expect;

const mongoose = require('mongoose');
mongoose.Promise = Promise;

describe ('User model', () => {

  it ('validates with username, password, and email', (done) => {
    const test_user = new User({
      username: 'testuser',
      password: 'testpass',
      email: 'user@test.com'
    });

    test_user.validate((err) => {
      done(err);
    });
  });

  it ('username is required', (done) => {
    const test_user = new User({
      password: 'testpass',
      email: 'user@test.com'
    });

    test_user.validate((err) => {
      if (!err) done('username should have been required');
      expect(err).to.be.ok;
      done();
    });
  });

  it ('password is required', (done) => {
    const test_user = new User({
      username: 'testuser',
      email: 'user@test.com'
    });

    test_user.validate((err) => {
      if (!err) done('password should have been required');
      expect(err).to.be.ok;
      done();
    });
  });

  it ('email is required', (done) => {
    const test_user = new User({
      username: 'testuser',
      password: 'testpass'
    });

    test_user.validate((err) => {
      if (!err) done('email should have been required');
      expect(err).to.be.ok;
      done();
    });
  });

});