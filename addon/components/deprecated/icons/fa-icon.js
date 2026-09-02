import Component from '@glimmer/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';
import layout from '../../../templates/components/deprecated/icons/fa-icon';

export default class FaIconComponent extends Component {
  constructor(...args) {
    super(...args);
  }

  tagName = 'span';
  classNames = ['legend-icon-layer'];
  layout = layout;

  options() {};

  spanStyle = computed('options.color', function () {
    return htmlSafe(this.options.color ? `color: ${this.options.color}` : '');
  })
};
