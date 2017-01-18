const router = require('express').Router();
const jsonParser = require('body-parser').json();
const User = require('../models/user');
const token = require('../auth/token');
const ensureAuth = require('../auth/ensure-auth')();

router.post('/signup', jsonParser, (req, res) => {
  const { username, password } = req.body;
  delete req.body.password;
    
  if (!password) {
    // these prop names don't match your error handler.
    // the curse of cut and paste sticks again!
    return res.status(400).json({
      msg: 'You probably want to include a password!'
    });
  }
    
  User.findOne({ username })
    .then(existing => {
      if (existing) {
        return res.status(500).json({
          msg: 'didn\'t work',
          reason: 'username already exists'
        });
      }
        
      const user = new User(req.body);
      user.generateHash(password);
      return user.save()
            .then(user => token.sign(user ))
            .then(token => res.json({ token }));
            
    })
    .catch(err => {
      res.status(500).json({
        msg: 'didn\'t work',
        reason: err
      });
    });
});

router.post('/signin', jsonParser, (req, res) => {
  const { username, password } = req.body;
  delete req.body;
    
  User.findOne({ username })
        .then(user => {
            
          if (!user) {
            return res.status(400).json({
              msg: 'authentication sez no!',
              reason: 'no user ' + username
            });
          }
            
          if (!user.compareHash(password )) {
            return res.status(400).json({
              msg: 'authentication sez no!',
              reason: 'password doesn\'t match!'
            });
          }
            
          token.sign(user).then(token => res.json({ token }));
        })
        .catch(err => {
          res.status(500).json({
            msg: 'didn\'t work',
            reason: err
          });
        });
    
});

router.get('/verify', ensureAuth, (req, res) => {
  res.status(200).send({ success: true });
});

module.exports = router;