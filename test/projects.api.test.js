const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

//Mongo needs to be running; this line is the Windows-compliant method
// instead of directly adding it to the npm test script
process.env.MONGODB_URI = 'mongodb://localhost/bigtodo-test';


const connection = require('../lib/setup-mongoose');
const db = require('./db');
const app = require('../lib/app');

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

  it('/GET all', () => request
        .get('/api/projects')
        .set(authHeader)
        .then(res => assert.deepEqual(res.body, []))
    );

  let project = {
    description: 'test project',
    duedate: '',
    parent: 'test parent',
    user: {
      '_id': '54cd6669d3e0fb1b302e54e4',
    },
  };

  it('/POST', () => request
        .post('/api/projects')
        .set(authHeader)
        .send(project)
        .then(({ body }) => {
          assert.ok(body._id);
          assert.equal(body.description, project.description);
          project = body;
        })
    );

  it('/GET by id', () => request
        .get(`/api/projects/${project._id}`)
        .set(authHeader)
        .then(({ body }) =>  {
          assert.equal(body._id, project._id);
          // assert.equal(body.description, project.description);
          // assert.isOk(body.pets);
          // assert.deepEqual(body.pets, [pet]);
        })
    );

  it('/GET all after post contains one item', () => request
        .get('/api/projects')
        .set(authHeader)
        .then(({ body }) => {
          assert.deepEqual(body, [project]);
        })
    );

  it('/DELETE project', () => request
        .delete(`/api/projects/${project._id}`)
        .set(authHeader)
    );

});