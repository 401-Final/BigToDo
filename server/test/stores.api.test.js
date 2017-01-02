const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');
const db = require('./db');
const app = require('../lib/app');

describe('stores', () => {

    before(db.drop(connection));

    const request = chai.request(app);

    let authHeader = null;    
    before(() => request
        .post('/api/auth/signup')
        .send({ 
            username: 'user',
            password: 'abc'
        })
        .then(({ body }) => {
            assert.isOk(body.token);
            authHeader = { Authorization: `Bearer ${body.token}` };
        })
    );

    let store = { name: 'cute store' };

    it('/GET all', () => request
        .get('/api/stores')
        .set(authHeader)
        .then(res => assert.deepEqual(res.body, []))
    );

    it('/POST', () => request
        .post('/api/stores')
        .set(authHeader)
        .send(store)
        .then(({ body }) => {
            assert.ok(body._id);
            assert.equal(body.name, store.name);
            store = body;
        })
    );

    let pet = { 
        name: 'lizzy',
        animal: 'lizard'
    };
    
    it('/POST pet with store id', () => {
        pet.store = store._id;
        return request
            .post('/api/pets')
            .set(authHeader)
            .send(pet)
            .then(({ body }) => pet = body);
    });

    it('/GET by id', () => request
        .get(`/api/stores/${store._id}`)
        .set(authHeader)
        .then(({ body }) =>  {
            assert.equal(body._id, store._id);
            assert.equal(body.name, store.name);
            assert.isOk(body.pets);
            assert.deepEqual(body.pets, [pet]);
        })
    );

    it('/GET all after post contains one item', () => request
        .get('/api/stores')
        .set(authHeader)
        .then(({ body }) => {
            assert.deepEqual(body, [store]);
        })
    );

    it('/DELETE store', () => request
        .delete(`/api/stores/${store._id}`)
        .set(authHeader)
    );

    it('/GET by id gives 404', () => request
        .get(`/api/stores/${store._id}`)
        .set(authHeader)
        .then(
            () => { throw new Error('unexpected success response'); },
            res => assert.equal(res.status, 404)
        )
    );

    it('removes associated pets', () => request
        .get('/api/pets')
        .set(authHeader)
        .then(res => res.body)
        .then(pets => assert.equal(pets.length, 0))
    );

});