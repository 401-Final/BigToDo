const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const User = require('../models/user');

router
  .get('/me', (req, res, next) => {
    User.findOne({ _id: req.user.id })
      .then((user) => {
        res.send(user);
      })
      .catch(next);
  })
  .put('/me', bodyParser, (req, res, next) => {
    User.findOneAndUpdate({ _id: req.user.id }, req.body)
      .then(saved => res.send(saved))
      .catch(next);
  })
  .delete('/me', bodyParser, (req, res, next) => {
    User.findOneAndRemove({ _id: req.user.id })
      .then(deleted => res.send(deleted))
      .catch(next);
  });

module.exports = router;