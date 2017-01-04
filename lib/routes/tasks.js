const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Task = require('../models/task');

router
  .get('/', (req, res, next) => {
    // find tasks with user = current user
    let query = { userId: req.user.id };
    Object.assign(query, req.query);
    Task.find(query).lean()
      .then(tasks => res.send(tasks))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Task.findOne({ userId: req.user.id, _id: req.params.id })
      .then((task) => res.send(task))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Task.findOneAndRemove({ userId: req.user.id, _id: req.params.id })
      .then(deleted => res.send(deleted))
      .catch(next);
  })
  .post('/', bodyParser, (req, res, next) => {
    let task = new Task(req.body);
    task.userId = req.user.id;
    task.save()
      .then(saved => res.send(saved))
      .catch(next);
  })
  .put('/:id', bodyParser, (req, res, next) => {
    Task.findOneAndUpdate({ userId: req.user.id, _id: req.params.id }, req.body)
      .then(saved => res.send(saved))
      .catch(next);
  });

module.exports = router;