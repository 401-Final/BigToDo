const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Project = require('../models/project');
const Task = require('../models/task');

router
.get('/', (req, res, next) => {
  // find projects with user = current user
  let query = { userId: req.user.id };
  if (req.query.parent) query.parentId = req.query.parent;
  Project.find(query).lean()
    .populate('parentId', 'description')
    .then(projects => res.send(projects))
    .catch(next);
})
.get('/:id', (req, res, next) => {
  // GET :id but how do we know this :id belongs to this user?
  Project.findOne({ userId: req.user.id, _id: req.params.id })
    .then((project) => res.send(project))
    .catch(next);
})
.delete('/:id', (req, res, next) => {
  Project.findOneAndRemove({ userId: req.user.id, _id: req.params.id })
    .then(deleted => {
      res.send(deleted);
      Project.update({ parentId: deleted._id}, { parentId: null }, { multi: true }).exec();
      Task.update({ projectId: deleted._id}, { projectId: null }, { multi: true }).exec();
      // Task.remove({ projectId: deleted._id}).exec();
    })
    .catch(next);
})
.post('/', bodyParser, (req, res, next) => {
  let proj = new Project(req.body);
  proj.userId = req.user.id;
  Project.findOne({description: req.body.parentId})
      .then(project => {
        if(project === null) {
          return proj.save();
        } else {
          proj.parentId = project._id;
          return proj.save();
        }
      })
      .then(savedProj => res.send(savedProj))
      .catch(next);
})
.put('/:id', bodyParser, (req, res, next) => {
  Project.findOneAndUpdate({ userId: req.user.id, _id: req.params.id }, req.body)
    .then(saved => res.send(saved))
    .catch(next);
});

module.exports = router;