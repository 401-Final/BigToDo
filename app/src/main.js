import angular from 'angular';
import './scss/main.scss';
// picks up index.js from components and services folder
import components from './components';
import services from './services';

// bring in 3rd party modules
import animate from 'angular-animate';
import uiRouter from 'angular-ui-router';
// plugin for "default" routes
import defaultRoute from 'angular-ui-router-default';
// need this for old $stateChanged events;
import 'angular-ui-router/release/stateEvents';

import resource from 'angular-resource';

import dialog from 'ng-dialog';
import 'ng-dialog/css/ngDialog.css';
import 'ng-dialog/css/ngDialog-theme-default.css';

// route, http config and auth setup
import http from './http';
import routes from './routes';
import auth from './auth';

const app = angular.module('myApp', [
  components,
  services,
  animate,
  uiRouter,
  angular.module('ui.router.state.events').name,
  defaultRoute,
  resource,
  dialog
]);

// app.value('apiUrl', 'https://pet-store-401.herokuapp.com/api');

app.config(http);
app.config(routes);
app.run(auth);