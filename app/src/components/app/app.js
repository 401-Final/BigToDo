import template from './app.html';

export default {
  template,
  controller
};

controller.$inject = ['userService'];

function controller(userService) {
  this.logout = () => userService.logout();
  this.isAuthenticated = () => userService.isAuthenticated();
}