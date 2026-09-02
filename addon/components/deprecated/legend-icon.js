import Component from '@glimmer/component';
import { computed } from '@ember/object';
import layout from '../../templates/components/deprecated/legend-icon';

export default class LegendIconComponent extends Component {
  constructor(...args) {
    super(...args);
  };

  icon = null;

  classNames = ['legend-icon'];
  layout = layout;

  iconType = computed('icon.type', function () {
    const type = this.get('icon.type');
    return type === 'fa-icon' ? 'fa-layers' : type;
  });
};
