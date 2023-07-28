import Component from '@ember/component';
import layout from '../../templates/components/deprecated/icon-tooltip';

export default Component.extend({
  tagName: 'span',
  classNames: 'icon-tooltip',

  layout,
  tip: '',
  side: 'top',
  icon: 'info-circle',
  transform: '',
  fixedWidth: false,
});
