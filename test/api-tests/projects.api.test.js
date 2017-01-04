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
  before((done) => {
    request
      .post('/api/auth/signup')
      .send({
        email: 'user@user.com', 
        username: 'user',
        password: 'abc'
      })
      .then(({ body }) => {
        assert.isOk(body.token);
        authHeader = { Authorization: `Bearer ${body.token}` };
        done();
      });
  });

  it ('GET /api/projects on empty DB returns empty array', (done) => request
    .get('/api/projects')
    .set(authHeader)
    .then(res => {
      assert.deepEqual(res.body, []);
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
    console.log('\nauthHeader ', authHeader);
    request
      .post('/api/projects')
      .set(authHeader)
      .send(project)
      .then(({ body }) => {
        assert.ok(body._id);
        project._id = body._id;
        project.__v = 0;
        assert.equal(body.description, project.description);
        assert.equal(body.parentId, project.parentId);
        assert.ok(body.userId);
        project = body; // to prep for the comparison on the next test
        console.log('\nproject ', project);
        child.parentId = project._id;
      })
      .then(() => {
        return request
          .post('/api/projects')
          .set(authHeader)
          .send(child)
          .then(({ body }) => {
            assert.ok(body._id);
            child._id = body._id;
            child.__v = 0;
            assert.equal(body.description, child.description);
            assert.equal(body.parentId, child.parentId);
            assert.ok(body.userId);
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
            assert.ok(body._id);
            grandchild._id = body._id;
            grandchild.__v = 0;
            assert.equal(body.description, grandchild.description);
            assert.equal(body.parentId, grandchild.parentId);
            assert.ok(body.userId);
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
        assert.deepEqual(body, project);
        done();
      })
      .catch(done);
  });

  it ('GET all after post contains three items', (done) => {
    request
      .get('/api/projects')
      .set(authHeader)
      .then(({ body }) => {
        assert.equal(body.length, 3);
        done();
      })
      .catch(done);
  });

  // POST two additional projects: child, grandchild.
  // GET /api/projects?parent=parent and verify you get child
  // GET /api/projects?parent=child and verify you get grandchild

  it ('GETs /api/projects?parent=project', (done) => {
    request
      .get(`/api/projects?parent=${project._id}`)
      .set(authHeader)
      .then((res) => {
        assert.deepEqual(res.body, [ child ]);
        done();
      })
      .catch(done);
  });

  it ('DELETE project removes from DB', (done) => {
    request
      .delete(`/api/projects/${project._id}`)
      .set(authHeader)
      .then(({ body }) => {
        assert.deepEqual(body, project);
        request
          .get('/api/projects')
          .set(authHeader)
          .then(({ body }) => {
            assert.equal(body.length, 2);
            console.log('The two remaining ', body);
            done();
          });
      })
      .catch(done);
  });

  // after((done) => {
  //   connection.close(done);
  // });

});