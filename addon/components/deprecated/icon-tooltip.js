import Component from '@glimmer/component';
import layout from '../../templates/components/deprecated/icon-tooltip';

export default class IconTooltipComponent extends Component {
  tagName = 'span';
  classNames = 'icon-tooltip';

  layout = layout;
  tip = '';
  side = 'top';
  icon = 'info-circle';
  transform = '';
  fixedWidth = false;
}
