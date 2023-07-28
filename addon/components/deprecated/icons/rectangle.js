import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from '../../../templates/components/deprecated/icons/rectangle';

export default Component.extend({
  init() {
    this._super(...arguments);
  },

  tagName: 'svg',
  classNames: ['legend-icon-layer', 'rectangle'],
  attributeBindings: ['height', 'width', 'viewBox', 'preserveAspectRatio'],

  layout,

  svgOptions: computed('options', function () {
    const defaultOptions = {
      stroke: 'SteelBlue',
      fill: 'rgba(70, 130, 180, 0.5)',
      'stroke-linejoin': 'round',
    };
    const options = this.options; // options should be an object

    return Object.assign(defaultOptions, options);
  }),

  height: 10,
  width: 17,
  viewBox: '0 0 17 10',
  preserveAspectRatio: 'xMinYMid',

  didInsertElement() {
    this._super(...arguments);
    const svgPath = this.element.querySelector('path');
    const svgOptions = this.svgOptions;
    Object.entries(svgOptions).forEach(([attr, value]) => {
      svgPath.setAttribute(attr, value);
    });
  },
});
