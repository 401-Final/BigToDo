const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
chai.use(chaiHttp);

// const connection = require('../lib/setup-mongoose');
// const db = require('./db');
// const app = require('../lib/app');

describe ('Users API', () => {

  it ('fails test because no tests are written', (done) => {
    expect(true).to.not.be.ok;
    done();
  });

});