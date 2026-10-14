const app = require('../backend/src/app');

module.exports = (req, res) => {
  // Ensure route prefix matches Express routes
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  return app(req, res);
};
