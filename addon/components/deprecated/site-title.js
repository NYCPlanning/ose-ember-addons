import Component from '@glimmer/component';
import layout from '../../templates/components/deprecated/site-title';

export default class SiteTitleComponent extends Component {
  tagName = 'span';
  layout = layout;
}
