const Project = require('../lib/models/project');
const expect = require('chai').expect;

describe ('project model', () => {

  it ('validates with description and user', (done) => {
    const test_project = new Project({
      description: 'Do this project',
      user: '1'
    });

    test_project.validate((err) => {
      done(err);
    });
  });

  it ('description is required', (done) => {
    const test_project = new Project({
      user: '1'
    });

    test_project.validate((err) => {
      if (!err) done('description should have been required');
      expect(err).to.be.ok;
      done();
    });
  });

  it ('user is required', (done) => {
    const test_project = new Project({
      description: 'Do this project'
    });

    test_project.validate((err) => {
      if (!err) done('user should have been required');
      expect(err).to.be.ok;
      done();
    });
  });

});