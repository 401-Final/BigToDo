const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');
const db = require('./db');
const app = require('../lib/app');

describe('pets', () => {

    const request = chai.request(app);

    before(db.drop(connection));
    
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

    let pet = { 
        name: 'the pet',
        animal: 'cat'
    };
    
    it('/POST pet with store id', () => {
        pet.store = store._id;
        return request
            .post('/api/pets')
            .set(authHeader)
            .send(pet)
            .then(({ body }) => {
                assert.isOk(body._id);
                assert.equal(body.name, pet.name);
                assert.equal(body.animal, pet.animal);
                pet = body;
            });
    });

    it('/DELETE pet', () => {
        const url = `/api/pets/${pet._id}`;
        return request.delete(url)
            .set(authHeader)
            .then(() => request.get(url).set(authHeader))
            .then(
                () => { throw new Error('unexpected success response'); },
                res => assert.equal(res.status, 404)
            );
    });
});