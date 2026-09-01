import Component from '@glimmer/component';
import layout from '../../templates/components/deprecated/legend-items';

export default Component.extend({
  classNames: ['legend-items'],
  items: null,
  layout,
});
