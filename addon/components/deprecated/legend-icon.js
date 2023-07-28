import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from '../../templates/components/deprecated/legend-icon';

export default Component.extend({
  init(...args) {
    this._super(...args);
  },

  icon: null,

  classNames: ['legend-icon'],
  layout,

  iconType: computed('icon.type', function () {
    const type = this.get('icon.type');
    return type === 'fa-icon' ? 'fa-layers' : type;
  }),
});
