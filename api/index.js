const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const multer = require('multer');
const setupRoutes = require('./routes');

// Setup mongoose
const mongoURI = (
  process.env.MONGO_URI
  || `mongodb://localhost/3dpixels${process.env.NODE_ENV === 'test' ? '-test' : ''}`
);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.connection.on('error', console.error);
mongoose.connection.on('disconnected', () => mongoose.connect(mongoURI));
mongoose.connect(mongoURI);

// Auto-wipe testing db
if (process.env.NODE_ENV === 'test') {
  mongoose.connection.once('connected', () => (
    mongoose.connection.db.dropDatabase()
  ));
}

// Setup express
const api = express();
if (process.env.NODE_ENV === 'production') {
  api.use(helmet());
}
api.use(compression());
api.use(cors());
api.use(bodyParser.json());
api.set('multer', multer({
  storage: multer.memoryStorage(),
}));

// Start server
setupRoutes(api);
api.listen(
  process.env.PORT
  || (process.env.NODE_ENV === 'test' ? 8082 : 8081)
);

module.exports = api;
