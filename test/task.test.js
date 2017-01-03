const Task = require('../lib/models/task');
const expect = require('chai').expect;

describe ('task model', () => {

  it ('validates with description', (done) => {
    const test_task = new Task({
      description: 'Do this task',
      user: '1'
    });

    test_task.validate((err) => {
      done(err);
    });
  });

  it ('description is required', (done) => {
    const test_task = new Task({
      user: '1'
    });

    test_task.validate((err) => {
      if (!err) done('description should have been required');
      expect(err).to.be.ok;
      done();
    });
  });

  it ('description is required', (done) => {
    const test_task = new Task({
      user: '1'
    });

    test_task.validate((err) => {
      if (!err) done('description should have been required');
      expect(err).to.be.ok;
      done();
    });
  });

});