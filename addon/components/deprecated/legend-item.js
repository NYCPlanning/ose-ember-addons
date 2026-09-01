import Component from '@glimmer/component';
import layout from '../../templates/components/deprecated/legend-item';

export default Component.extend({
  classNames: ['legend-item'],
  item: null,
  layout,
});
