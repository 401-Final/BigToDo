const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const User = require('../models/user');

router
  .put('/:id', bodyParser, (req, res, next) => {
    User.findOneAndUpdate({ userId: req.user.id, _id: req.params.id }, req.body)
      .then(saved => res.send(saved))
      .catch(next);
  });

module.exports = router;