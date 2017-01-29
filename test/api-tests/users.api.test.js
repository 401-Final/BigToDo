const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
chai.use(chaiHttp);

process.env.MONGODB_URI = 'mongodb://localhost/bigtodo-test';

const connection = require('../../lib/setup-mongoose');
const db = require('../db');
const app = require('../../lib/app');

describe ('Users API', () => {

  before(db.drop(connection));

  const request = chai.request(app);

  const testUser = {
    username: 'tester',
    password: 'testerpass',
    email: 'tester@testing.com'
  };

  let authHeader = null;

  before((done) => {
    request
      .post('/api/auth/signup')
      .send(testUser)
      .then(({ body }) => {
        expect(body.token).to.be.ok;
        authHeader = { Authorization: `Bearer ${body.token}` };
        done();
      })
      .catch(done);
  });

  // let userId = null;

  it ('GET /api/users/me', (done) => {
    request
      .get('/api/users/me')
      .set(authHeader)
      .then(({ body }) => {
        expect(body.username).to.equal(testUser.username);
        expect(body.email).to.equal(testUser.email);
        done();
      })
      .catch(done);
  });

  // after((done) => {
  //   connection.close(done);
  // });

});