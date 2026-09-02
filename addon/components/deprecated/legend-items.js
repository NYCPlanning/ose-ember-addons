import Component from '@glimmer/component';
import layout from '../../templates/components/deprecated/legend-items';

export default class LegendItemsComponent extends Component {
  constructor(...args) {
    super(...args);
  }

  classNames = ['legend-items'];
  items = null;
  layout = layout;
}
