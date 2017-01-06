const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Task = require('../models/task');
const Context = require('../models/context');
const Project = require('../models/project');

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
    Context.findOne({name: req.body.contextId})
      .then(context => {
        return context;
      })
      .then(context => {
        Project.findOne({description: req.body.projectId})
          .then(project => {
            if (context === null && project === null) {
              return task.save();
            } else if (context && project === null) {
              task.contextId = context._id;
              return task.save();
            } else if (context === null && project) {
              task.projectId = project._id;
              return task.save();
            } else {
              task.contextId = context._id;
              task.projectId = project._id;
              return task.save();
            }
          });
      })
      .then(savedTask => res.send(savedTask))
      .catch(next);
  })
  .put('/:id', bodyParser, (req, res, next) => {
    Task.findOneAndUpdate({ userId: req.user.id, _id: req.params.id }, req.body)
      .then(saved => res.send(saved))
      .catch(next);
  });

module.exports = router;