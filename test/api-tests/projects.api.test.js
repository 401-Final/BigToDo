const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
chai.use(chaiHttp);

//Mongo needs to be running; this line is the Windows-compliant method
// instead of directly adding it to the npm test script
process.env.MONGODB_URI = 'mongodb://localhost/bigtodo-test';

const connection = require('../../lib/setup-mongoose');
const db = require('../db');
const app = require('../../lib/app');

describe('projects api', () => {

  before(db.drop(connection));

  const request = chai.request(app);

  let authHeader = null;
  let authHeader2 = null;

  const user = {
    username: 'user',
    password: 'abc',
    email: 'user@mail.com'    
  };

  const user2 = {
    username: 'user2',
    password: 'xyz',
    email: 'user2@mail.com'
  };

  before((done) => {
    request
      .post('/api/auth/signup')
      .send(user)
      .then(({ body }) => {
        expect(body.token).to.be.ok;
        authHeader = { Authorization: `Bearer ${body.token}` };
        done();
      });
  });

  before((done) => {
    request
      .post('/api/auth/signup')
      .send(user2)
      .then(({ body }) => {
        expect(body.token).to.be.ok;
        authHeader2 = { Authorization: `Bearer ${body.token}` };
        done();
      });
  });

  it ('GET /api/projects on empty DB returns empty array', (done) => request
    .get('/api/projects')
    .set(authHeader)
    .then(res => {
      expect(res.body).to.deep.equal([]);
      done();
    })
    .catch(done)
  );

  let project = {
    description: 'test project'
  };

  let child = {
    description: 'test project child'
  };

  let grandchild = {
    description: 'test project grandchild'
  };

  it ('POST /api/projects {project} posts project(s) to DB', (done) => {
    request
      .post('/api/projects')
      .set(authHeader)
      .send(project)
      .then(({ body }) => {
        expect(body._id).to.be.ok;
        project._id = body._id;
        project.__v = 0;
        expect(body.description).to.equal(project.description);
        expect(body.parentId).to.equal(project.parentId);
        expect(body.userId).to.be.ok;
        project = body; // to prep for the comparison on the next test
        child.parentId = project._id;
      })
      .then(() => {
        return request
          .post('/api/projects')
          .set(authHeader)
          .send(child)
          .then(({ body }) => {
            expect(body._id).to.be.ok;
            child._id = body._id;
            child.__v = 0;
            expect(body.description).to.equal(child.description);
            expect(body.parentId).to.equal(child.parentId);
            expect(body.userId).to.be.ok;
            child = body;
            grandchild.parentId = child._id;
          });
      })
      .then(() => {
        request
          .post('/api/projects')
          .set(authHeader)
          .send(grandchild)
          .then(({ body }) => {
            expect.ok(body._id);
            grandchild._id = body._id;
            grandchild.__v = 0;
            expect(body.description).to.equal(grandchild.description);
            expect(body.parentId).to.equal(grandchild.parentId);
            expect(body.userId).to.be.ok;
            grandchild = body;
          });
        done();
      })
      .catch(done);
  });

  it ('GET by id returns the POSTed project', (done) => {
    request
      .get(`/api/projects/${project._id}`)
      .set(authHeader)
      .then(({ body }) =>  {
        expect(body).to.deep.equal(project);
        done();
      })
      .catch(done);
  });

  it ('GET all after post contains three items', (done) => {
    request
      .get('/api/projects')
      .set(authHeader)
      .then(({ body }) => {
        expect(body.length).to.equal(3);
        done();
      })
      .catch(done);
  });

  it ('GETs /api/projects?parent=project', (done) => {
    request
      .get(`/api/projects?parent=${project._id}`)
      .set(authHeader)
      .then((res) => {
        child.parentId = { _id: project._id, description: project.description };
        expect(res.body).to.deep.equal([ child ]);
        done();
      })
      .catch(done);
  });

  it ('DELETE project removes from DB', (done) => {
    request
      .delete(`/api/projects/${project._id}`)
      .set(authHeader)
      .then(({ body }) => {
        expect(body).to.deep.equal(project);
        request
          .get('/api/projects')
          .set(authHeader)
          .then(({ body }) => {
            expect(body.length).to.equal(2);
            done();
          });
      })
      .catch(done);
  });

  // TODO: Authenticate as different user, make sure you only get your own tasks

  it ('second user cannot see first user\'s tasks', (done) => {
    request
      .get('/api/projects')
      .set(authHeader2)
      .then(({ body }) => {
        expect(body).to.deep.equal([]);
        done();
      })
      .catch(done);
  });

  // it ('second user POSTs a project', (done) => {
  //   request
  //     .post('/api/projects')
  //     .set(authHeader2)
  //     .send(user2project)
  //     .then((saved) => {
  //       done();
  //     })
  //     .catch(done);
  // });

  // after((done) => {
  //   connection.close(done);
  // });

});