// const express = require('express');
// const router = express.Router();
// const bodyParser = require('body-parser').json();
// const Pet = require('../models/pet');

// router
//     .get('/', (req, res, next) => {
//       Pet.find(req.query).lean()
//             .then(pets => res.send(pets))
//             .catch(next);
//     })  

//     .get('/:id', (req, res, next) => {
//       const id = req.params.id;
//       Pet.findById(id)
//             .lean()
//             .then(pet => {
//               if(!pet) throw { 
//                 code: 404, 
//                 error: `pet ${id} does not exist`
//               };
//               res.send(pet);
//             })
//             .catch(next);
//     })  

//     .delete('/:id', (req, res, next) => {
//       Pet.findByIdAndRemove(req.params.id)
//             .then(deleted => res.send(deleted))
//             .catch(next);
//     })

//     .post('/', bodyParser, (req, res, next) => {
//       new Pet(req.body).save()
//             .then(saved => res.send(saved))
//             .catch(err => {
//               next(err);
//             });
//     })

//     .put('/:id', bodyParser, (req, res, next) => {
//       Pet.findByIdAndUpdate(req.params.id, req.body)
//             .then(saved => res.send(saved))
//             .catch(next);
//     });

// module.exports = router;