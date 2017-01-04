const express = require('express');
const app = express();

/* middleware */
const morgan = require('morgan');
const redirectHttp = require('./redirect-http')();
const cors = require('cors')();
const checkDb = require('./check-connection')();
const errorHandler = require('./error-handler')();
const ensureAuth = require('./auth/ensure-auth')();

app.use(morgan('dev'));
// CORS is required for redirect to work
app.use(cors);
// Redirect http to https in production
if(process.env.NODE_ENV === 'production') {
  app.use(redirectHttp);
}
app.use(express.static('./public'));

/* routes */
const auth = require('./routes/auth');
const projects = require('./routes/projects');
const tasks = require('./routes/tasks');
const contexts = require('./routes/contexts');
const users = require('./routes/users');
app.use(checkDb);
app.use('/api/auth', auth);
app.use('/api/projects', ensureAuth, projects);
app.use('/api/tasks', ensureAuth, tasks);
app.use('/api/contexts', ensureAuth, contexts);
app.use('/api/users', ensureAuth, users);

//make function to create all of this?

app.use(errorHandler);

module.exports = app;