const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Store = require('../models/store');
const Pet = require('../models/pet');

router
    .get('/', (req, res, next) => {
      Store.find().lean()
            .then(stores => res.send(stores))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
      const id = req.params.id;

      Promise.all([
        Store.findById(id).lean(),
        Pet.find({ store: id }).lean()
      ])
        .then(([store, pets]) => {
          if(!store) throw { 
            code: 404, 
            error: `store ${id} does not exist`
          };
          store.pets = pets;
          res.send(store);
        })
        .catch(next);
    })

    .delete('/:id', (req, res, next) => {
      const store = req.params.id;

      Promise.all([
        Store.findByIdAndRemove(store),
        Pet.find({ store }).remove()
      ])
        .then(([store]) => res.send(store))
        .catch(next);
    })

    .post('/', bodyParser, (req, res, next) => {
      new Store(req.body).save()
            .then(saved => res.send(saved))
            .catch(next);
    });


module.exports = router;