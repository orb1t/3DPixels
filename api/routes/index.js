const nocache = require('nocache');
const meshes = require('./meshes');
const user = require('./user');
const User = require('../models/user');

const preventCache = nocache();
const requireAuth = (req, res, next) => {
  if (req.headers.authorization) {
    const header = req.headers.authorization.split(' ');
    if (
      header[0] === 'Bearer'
      && header[1]
    ) {
      User
        .fromToken(header[1])
        .then((user) => {
          if (!user) {
            res.status(401).end();
            return;
          }
          req.user = user;
          next();
        })
        .catch(() => res.status(500).end());
      return;
    }
  }
  res.status(401).end();
};

module.exports = (api) => {
  // Meshes
  api.put(
    '/meshes',
    preventCache,
    requireAuth,
    api.get('multer').single('texture'),
    meshes.create
  );

  api.put(
    '/meshes/:id',
    preventCache,
    requireAuth,
    api.get('multer').single('texture'),
    meshes.update
  );

  api.get(
    '/meshes/latest/:page',
    meshes.listAll
  );

  api.get(
    '/meshes/:id',
    meshes.get
  );

  api.get(
    '/meshes/:id/texture',
    meshes.getTexture
  );

  // User
  api.put(
    '/user',
    preventCache,
    user.create
  );

  api.post(
    '/user',
    preventCache,
    user.login
  );

  api.get(
    '/user',
    preventCache,
    requireAuth,
    user.refreshToken
  );

  api.get(
    '/user/:id',
    user.get
  );

  api.get(
    '/user/:id/meshes/:page',
    meshes.listByCreator
  );
};
