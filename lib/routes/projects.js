const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Project = require('../models/project');

router
.get('/', (req, res, next) => {
  // find projects with user = current user
  let query = { userId: req.user.id };
  if (req.query.parentId) query.parentId = req.query.parentId;
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
    .then(deleted => res.send(deleted))
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