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

describe('tasks api', () => {

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

  it ('GET /api/tasks on empty DB returns empty array', (done) => request
    .get('/api/tasks')
    .set(authHeader)
    .then(res => {
      expect(res.body).to.deep.equal([]);
      done();
    })
    .catch(done)
  );

  let task = {
    description: 'test task'
  };

  // let child = {
  //   description: 'test task child'
  // };

  // let grandchild = {
  //   description: 'test task grandchild'
  // };

  it ('POST /api/tasks {task} posts task(s) to DB', (done) => {
    request
      .post('/api/tasks')
      .set(authHeader)
      .send(task)
      .then(({ body }) => {
        expect(body._id).to.be.ok;
        task._id = body._id;
        task.__v = 0;
        expect(body.description).to.equal(task.description);
        expect(body.parentId).to.equal(task.parentId);
        expect(body.userId).to.be.ok;
        task = body; // to prep for the comparison on the next test
        done();
      })
      .catch(done);
  });

  it ('GET by id returns the POSTed task', (done) => {
    request
      .get(`/api/tasks/${task._id}`)
      .set(authHeader)
      .then(({ body }) =>  {
        expect(body).to.deep.equal(task);
        done();
      })
      .catch(done);
  });

  it ('second user cannot see first user\'s tasks', (done) => {
    request
      .get('/api/tasks')
      .set(authHeader2)
      .then(({ body }) => {
        expect(body).to.deep.equal([]);
        done();
      })
      .catch(done);
  });

  // it ('GET all after post contains three items', (done) => {
  //   request
  //     .get('/api/tasks')
  //     .set(authHeader)
  //     .then(({ body }) => {
  //       expect(body.length).to.equal(3);
  //       done();
  //     })
  //     .catch(done);
  // });

  // it ('GETs /api/tasks?parent=task', (done) => {
  //   request
  //     .get(`/api/tasks?parent=${task._id}`)
  //     .set(authHeader)
  //     .then((res) => {
  //       expect(res.body).to.deep.equal([ child ]);
  //       done();
  //     })
  //     .catch(done);
  // });

  it ('DELETE task removes from DB', (done) => {
    request
      .delete(`/api/tasks/${task._id}`)
      .set(authHeader)
      .then(({ body }) => {
        expect(body).to.deep.equal(task);
        request
          .get('/api/tasks')
          .set(authHeader)
          .then(({ body }) => {
            expect(body).to.deep.equal([]);
            done();
          });
      })
      .catch(done);
  });

  // TODO: Authenticate as different user, make sure you only get your own tasks

  // it ('second user POSTs a task', (done) => {
  //   request
  //     .post('/api/tasks')
  //     .set(authHeader2)
  //     .send(user2task)
  //     .then((saved) => {
  //       done();
  //     })
  //     .catch(done);
  // });

  // after((done) => {
  //   connection.close(done);
  // });

});