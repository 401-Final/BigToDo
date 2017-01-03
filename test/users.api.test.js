const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');
const db = require('./db');
const app = require('../lib/app');

describe('users', () => {

  const request = chai.request(app);

  before(db.drop(connection));
    
  let authHeader = null;
    
  before(() => {
    request
      .post('/api/auth/signup')
      .send({ 
        username: 'testuser',
        password: 'testpass',
        email: 'user@test.com'
      })
      .then(({ body }) => {
        assert.isOk(body.token);
        authHeader = { Authorization: `Bearer ${body.token}` };
      });
  });

  let store = null;
  
  before(() => request
    .post('/api/stores')
    .set(authHeader)
    .send({ name: 'best store' })
    .then(({ body }) => {
      store = body;
      assert.isOk(store._id);
    })
  );

  it('cannot /POST without store id', () => request
    .post('/api/pets')
    .set(authHeader)
    .send({ name: 'bobby', animal: 'cat' })
    .then(
      () => { throw new Error('unexpected success response'); },
      res => assert.equal(res.status, 400)
    )
  );

});