const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Project = require('../models/project');

router
.get('/', (req, res, next) => {
  Project.find().lean()
    .then(projects => res.send(projects))
    .catch(next);
})
.get('/:id', (req, res, next) => {
  Project.findById(req.params.id)
    .then(project => res.send(project ))
    .catch(next);
})
.delete('/:id', (req, res, next) => {
  Project.findByIdAndRemove(req.params.id)
    .then(deleted => res.send(deleted ))
    .catch(next);
})
.post('/', bodyParser, (req, res, next) => {
  let proj = new Project(req.body);
  proj.user = req.user.id;
  proj.save()
    .then(saved => res.send(saved))
    .catch(next);
})
.put('/:id', bodyParser, (req, res, next) => {
  Project.findByIdAndUpdate(req.params.id, req.body)
    .then(saved => res.send(saved))
    .catch(next);
});

module.exports = router;