import Component from '@glimmer/component';
import layout from '../../templates/components/deprecated/layer-group-toggle';
import { action } from '@ember/object';

export default class LayerGroupToggleComponent extends Component {
  constructor(...args) {
    super(...args);

    this.didInit(this);

    this.icon = [];
  };

  classNames = ['layer-group-toggle'];
  classNameBindings = ['active'];

  layout = layout;

  label = null;

  tooltip = '';

  infoLink = '';

  infoLinkIcon = 'external-link-alt';

  tooltipIcon ='info-circle';

  active = true;

  activeTooltip = '';

  activeTooltipIcon = 'exclamation-triangle';

  didInit() {};

  willDestroyHook() {};

  willDestroy() {
    if (super.willDestroy) {
      super.willDestroy(...arguments);
    }
    this.willDestroyHook(this);
  };

  @action
  toggle() {
    console.log('toggle called');
    this.toggleProperty('active');
  };
};
