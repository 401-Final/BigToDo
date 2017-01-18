const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Context = require('../models/context');
const Task = require('../models/task');

router
.get('/', (req, res, next) => {
  // find contexts with user = current user
  // well-done two lines of code here, both concept and execution
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
  const id = req.params.id;
  Promise.all([
    Context.findOneAndRemove({ userId: req.user.id, _id: id }),
    Task.update({ contextId: id }, { contextId: null }, { multi: true })
  ])
    .then(([deleted]) => {
      res.send(deleted);
    })
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
    .then(saved => {
      res.send(saved);
      // Task.update({ contextId: saved._id}, { contextId: null }, { multi: true }).exec();
    })
    .catch(next);
});

module.exports = router;