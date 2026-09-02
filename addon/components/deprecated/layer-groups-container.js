import Component from '@glimmer/component';
import { computed } from '@ember/object';
import { next } from '@ember/runloop';
import { A } from '@ember/array';
import layout from '../../templates/components/deprecated/layer-groups-container';
import { action } from '@ember/object';

export default class LayerGroupsContainerComponent extends Component {
  constructor(...args) {
    super(...args);

    this.set('layerGroupToggleItems', A([]));
  };

  layout = layout;

  classNames = ['layer-groups-container'];
  classNameBindings = ['open', 'numberMenuItems:has-active-layer-groups'];

  numberMenuItems = computed('layerGroupToggleItems.@each.active', function () {
    const items = this.layerGroupToggleItems;

    const activeStates = items.mapBy('active');

    return activeStates.reduce((acc, curr) => {
      let mutatedAcc = acc;
      if (curr) {
        mutatedAcc += 1;
      }

      return mutatedAcc;
    }, 0);
  });

  open = true;

  mapIsLoading = false;

  title = null;

  @action
  toggleLayerGroupsContainer() {
    this.toggleProperty('open');
  };

  @action
  registerChild(componentContext) {
    next(() => {
      this.layerGroupToggleItems.pushObject(componentContext);
    });
  };

  @action
  unregisterChild(componentContext) {
    next(() => {
      this.layerGroupToggleItems.removeObject(componentContext);
    });
  };
};
