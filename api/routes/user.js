const { body, validationResult } = require('express-validator/check');
const User = require('../models/user');

module.exports.create = [
  body('email')
    .isEmail()
    .normalizeEmail(),
  body('name')
    .not().isEmpty()
    .trim()
    .escape(),
  body('password')
    .not().isEmpty()
    .trim()
    .escape(),
  (req, res) => {
    if (!validationResult(req).isEmpty()) {
      res.status(422).end();
    }
    const user = new User({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    });
    user.save((err) => {
      if (err) {
        res.status(500).end();
        return;
      }
      res.json(user.issueToken());
    });
  },
];

module.exports.login = [
  body('email')
    .isEmail()
    .normalizeEmail(),
  body('password')
    .not().isEmpty()
    .trim()
    .escape(),
  (req, res) => {
    if (!validationResult(req).isEmpty()) {
      res.status(422).end();
    }
    User
      .findOne({ email: req.body.email }, (err, user) => {
        if (err || !user) {
          res.status(err ? 500 : 401).end();
          return;
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (err || !isMatch) {
            res.status(err ? 500 : 401).end();
            return;
          }
          res.json(user.issueToken());
        });
      });
  },
];
