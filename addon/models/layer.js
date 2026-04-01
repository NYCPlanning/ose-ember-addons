import Model, { attr, belongsTo } from '@ember-data/model';
import { computed, set } from '@ember/object';
import { alias, reads } from '@ember/object/computed';
import { copy } from 'ember-copy';
import { assign } from '@ember/polyfills';

/**
  Model for individual layers. Belongs to a layer-group. May be called individually for state changes.

  @public
  @class LayerModel
*/
export default Model.extend({
  init(...args) {
    this._super(...args);

    // enforce presence of blank object for mapboxGL validation
    if (!this.get('style.layout')) this.set('style.layout', {});

    // determine which is the first occurring layer
    // for testing, should check that a related layer group exists
    if (
      this.layerVisibilityType === 'singleton' &&
      this.layerGroup &&
      !this.get('layerGroup._firstOccurringLayer')
    ) {
      this.set('layerGroup._firstOccurringLayer', this.id);
      this.set('position', 1);
    }

    this.delegateVisibility();
    this.addObserver('layerGroup.visible', this, 'delegateVisibility');
  },

  delegateVisibility() {
    const visible = this.get('layerGroup.visible');

    if (this.layerVisibilityType === 'singleton') {
      if (this.position === 1 && visible) {
        this.set('visibility', true);
      } else {
        this.set('visibility', false);
      }
    } else {
      this.set('visibility', visible);
    }
  },

  layerGroup: belongsTo('layer-group', { async: false }),

  position: attr('number', { defaultValue: -1 }),
  before: attr('string', { defaultValue: 'boundary_country' }),
  displayName: attr('string'),
  style: attr('hash', { defaultValue: () => ({}) }),

  highlightable: attr('boolean', { defaultValue: false }),
  clickable: attr('boolean', { defaultValue: false }),
  tooltipable: attr('boolean', { defaultValue: false }),
  tooltipTemplate: attr('string', { defaultValue: '' }),

  paint: alias('style.paint'),
  layout: alias('style.layout'),
  layerVisibilityType: alias('layerGroup.layerVisibilityType'),

  mapboxGlStyle: reads('style'),

  filter: computed('style.filter', {
    get() {
      return this.get('style.filter');
    },
    set(key, filter) {
      const newFilter = assign({}, this.style, { filter });
      this.set('style', newFilter);
      return newFilter;
    },
  }),

  visibility: computed('layout.visibility', {
    get() {
      return this.get('layout.visibility') === 'visible';
    },
    set(key, value) {
      const parentVisibilityState = value && this.get('layerGroup.visible');
      const visibility = parentVisibilityState ? 'visible' : 'none';
      const layout = copy(this.layout);

      if (layout) {
        set(layout, 'visibility', visibility);
        this.set('layout', layout);
      }

      return visibility === 'visible';
    },
  }),
});
