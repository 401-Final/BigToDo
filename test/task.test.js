const Task = require('../lib/models/task');
const expect = require('chai').expect;

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const userId = new mongoose.Types.ObjectId();

describe ('Task model', () => {

  it ('validates with description and user', (done) => {
    const test_task = new Task({
      description: 'Do this task',
      user: userId
    });

    test_task.validate((err) => {
      done(err);
    });
  });

  it ('description is required', (done) => {
    const test_task = new Task({
      user: userId
    });

    test_task.validate((err) => {
      if (!err) done('description should have been required');
      expect(err).to.be.ok;
      done();
    });
  });

  it ('user is required', (done) => {
    const test_task = new Task({
      description: 'Do this task'
    });

    test_task.validate((err) => {
      if (!err) done('description should have been required');
      expect(err).to.be.ok;
      done();
    });
  });

});