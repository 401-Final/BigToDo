const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Project = require('../models/project');
const Task = require('../models/task');

router
.get('/', (req, res, next) => {
  // find projects with user = current user
  let query = { userId: req.user.id };
  console.log('req.query = ', req.query);
  if (req.query.parent) query.parentId = req.query.parent;
  console.log('\n\nquery object: ', query, '\n\n');
  Project.find(query).lean()
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
      console.log('deleted id', typeof deleted._id);
      res.send(deleted);
      Project.update({ parentId: deleted._id}, { parentId: null }, { multi: true }).exec();
      Task.remove({ projectId: deleted._id}).exec();
    })
    .catch(next);
})
.post('/', bodyParser, (req, res, next) => {
  let proj = new Project(req.body);
  proj.userId = req.user.id;
  proj.save()
    .then(saved => res.send(saved))
    .catch(next);
})
.put('/:id', bodyParser, (req, res, next) => {
  Project.findOneAndUpdate({ userId: req.user.id, _id: req.params.id }, req.body)
    .then(saved => res.send(saved))
    .catch(next);
});

module.exports = router;