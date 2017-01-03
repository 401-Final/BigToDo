const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
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
  before(() => request
        .post('/api/auth/signup')
        .send({
          email: 'user@user.com', 
          username: 'user',
          password: 'abc'
        })
        .then(({ body }) => {
          assert.isOk(body.token);
          authHeader = { Authorization: `Bearer ${body.token}` };
        })
    );

  it('GET /api/projects on empty DB returns empty array', (done) => request
    .get('/api/projects')
    .set(authHeader)
    .then(res => {
      assert.deepEqual(res.body, []);
      done();
    })
    .catch(done)
  );

  let project = {
    description: 'test project',
    parent: 'test parent',
  };

  it('POST /api/projects {project} posts project to DB', (done) => {
    request
      .post('/api/projects')
      .set(authHeader)
      .send(project)
      .then(({ body }) => {
        assert.ok(body._id);
        project._id = body._id;
        project.__v = 0;
        assert.equal(body.description, project.description);
        assert.equal(body.parent, project.parent);
        assert.ok(body.user);
        project = body; // to prep for the comparison on the next test
        done();
      })
      .catch(done);
  });

  it('GET by id returns the POSTed project', (done) => {
    request
      .get(`/api/projects/${project._id}`)
      .set(authHeader)
      .then(({ body }) =>  {
        assert.deepEqual(body, project);
        done();
      })
      .catch(done);
  });

  it('GET all after post contains one item', (done) => {
    request
      .get('/api/projects')
      .set(authHeader)
      .then(({ body }) => {
        assert.deepEqual(body, [project]);
        done();
      })
      .catch(done);
  });

  it('DELETE project removes from DB', (done) => {
    request
      .delete(`/api/projects/${project._id}`)
      .set(authHeader)
      .then(({ body }) => {
        assert.deepEqual(body, project);
        request
          .get('/api/projects')
          .set(authHeader)
          .then(({ body }) => {
            assert.deepEqual(body, []);
            done();
          });
      })
      .catch(done);
  });

});