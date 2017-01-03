const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Context = require('../models/context');

router
.get('/', (req, res, next) => {
  // find contexts with user = current user
  let query = { userId: req.user.id };
  Object.assign(query, req.query);
  Context.find(query).lean()
    .then(contexts => res.send(contexts))
    .catch(next);
})
.get('/:id', (req, res, next) => {
  Context.findOne({ userId: req.user.id, _id: req.params.id })
    .then((context) => res.send(context))
    .catch(next);
})
.delete('/:id', (req, res, next) => {
  Context.findOneAndRemove({ userId: req.user.id, _id: req.params.id })
    .then(deleted => res.send(deleted))
    .catch(next);
})
.post('/', bodyParser, (req, res, next) => {
  let context = new Context(req.body);
  context.userId = req.user.id;
  context.save()
    .then(saved => res.send(saved))
    .catch(next);
})
.put('/:id', bodyParser, (req, res, next) => {
  Context.findOneAndUpdate({ userId: req.user.id, _id: req.params.id }, req.body)
    .then(saved => res.send(saved))
    .catch(next);
});

module.exports = router;