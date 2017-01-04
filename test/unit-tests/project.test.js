const Project = require('../../lib/models/project');
const expect = require('chai').expect;

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const projId = new mongoose.Types.ObjectId();
const userId = new mongoose.Types.ObjectId();

describe ('Project model', () => {

  it ('validates with description and user', (done) => {
    const test_project = new Project({
      description: 'Do this project',
      parentId: projId,
      userId: userId
    });

    test_project.validate((err) => {
      done(err);
    });
  });

  it ('description is required', (done) => {
    const test_project = new Project({
      parentId: projId,
      userId: userId
    });

    test_project.validate((err) => {
      if (!err) done('description should have been required');
      expect(err).to.be.ok;
      done();
    });
  });

  it ('user is required', (done) => {
    const test_project = new Project({
      description: 'Do this project',
      parentId: projId
    });

    test_project.validate((err) => {
      if (!err) done('user should have been required');
      expect(err).to.be.ok;
      done();
    });
  });

  // it ('parent is required', (done) => {
  //   const test_project = new Project({
  //     description: 'Do this project',
  //     user: userIdId
  //   });

  //   test_project.validate((err) => {
  //     if (!err) done('description should have been required');
  //     expect(err).to.be.ok;
  //     done();
  //   });
  // });

});