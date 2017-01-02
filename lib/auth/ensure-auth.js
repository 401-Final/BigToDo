const tokenChecker = require('./token');

module.exports = function getEnsureAuth() {
    
  return function ensureAuth(req, res, next) {
        // CORS "OPTIONS" method never includes headers,
        // so there is no token at this point, allow to proceed
    if (req.method === 'OPTIONS') return next();

    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.replace('Bearer ', '') : '';

    if (!token) {
      return res.status(403).json({
        error: 'no token provided'
      });
    }
        
    tokenChecker.verify(token)
            .then(payload => {
              req.user = payload;
              next();
            })
            .catch(() => {
              res.status(403).json({
                error: 'invalid token'
              });
            });
        
  };
};