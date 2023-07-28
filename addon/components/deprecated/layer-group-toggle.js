import Component from '@ember/component';
import layout from '../../templates/components/deprecated/layer-group-toggle';

export default Component.extend({
  init(...args) {
    this._super(...args);

    this.didInit(this);

    this.set('icon', []);
  },

  classNames: ['layer-group-toggle'],
  classNameBindings: ['active'],

  layout,

  label: null,

  tooltip: '',

  infoLink: '',

  infoLinkIcon: 'external-link-alt',

  tooltipIcon: 'info-circle',

  active: true,

  activeTooltip: '',

  activeTooltipIcon: 'exclamation-triangle',

  didInit() {},

  willDestroyHook() {},

  willDestroy() {
    this._super(...arguments);
    this.willDestroyHook(this);
  },

  actions: {
    toggle() {
      this.toggleProperty('active');
    },
  },
});
