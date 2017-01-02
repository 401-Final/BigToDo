import template from './user.html';
import styles from './user.scss';

export default {
  template,
  bindings: {
    user: '='
  },
  controller: function(){
    this.styles = styles;
  }
};