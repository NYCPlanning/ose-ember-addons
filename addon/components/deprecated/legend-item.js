import Component from '@glimmer/component';
import layout from '../../templates/components/deprecated/legend-item';

export default class LegendItemComponent extends Component {
  constructor(...args) {
    super(...args);
  }

  classNames = ['legend-item'];
  item = null;
  layout = layout;
}
