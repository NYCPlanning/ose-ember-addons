import Model, { attr, belongsTo } from '@ember-data/model';
import { computed, set } from '@ember/object';
import { alias } from '@ember/object/computed';
import { copy } from 'ember-copy';
import { assign } from '@ember/polyfills';
import { next } from '@ember/runloop';

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
      this.get('layerVisibilityType') === 'singleton' &&
      this.get('layerGroup') &&
      !this.get('layerGroup._firstOccurringLayer')
    ) {
      this.set('layerGroup._firstOccurringLayer', this.get('id'));
      this.set('position', 1);
    }

    this.delegateVisibility();
    this.addObserver('layerGroup.visible', this, 'delegateVisibility');
  },

  delegateVisibility() {
    const visible = this.get('layerGroup.visible');

    if (this.layerVisibilityType === 'singleton') {
      if (this.position === 1 && this.get('layerGroup.visible')) {
        next(() => this.set('visibility', true));
      } else {
        next(() => this.set('visibility', false));
      }
    } else {
      next(() => this.set('visibility', visible));
    }
  },

  layerGroup: belongsTo('layer-group', { async: false }),

  position: attr('number', { defaultValue: -1 }),
  before: attr('string', { defaultValue: 'boundary_country' }),
  displayName: attr('string'),
  style: attr('hash', { defaultValue: () => ({}) }),

  /**
    Determines whether to fire mouseover events for the layer.
    @property highlightable
    @type Boolean
  */
  highlightable: attr('boolean', { defaultValue: false }),

  /**
    Determines whether to fire click events for the layer.
    @property clickable
    @type Boolean
  */
  clickable: attr('boolean', { defaultValue: false }),

  /**
    Determines whether to render positioned tooltip components for the layer.
    @property tooltipable
    @type Boolean
  */
  tooltipable: attr('boolean', { defaultValue: false }),

  /**
    Optional template for tooltips. Does not handle any rendering.
    @property tooltipTemplate
    @type String
  */
  tooltipTemplate: attr('string', { defaultValue: '' }),

  paint: alias('style.paint'),
  layout: alias('style.layout'),
  layerVisibilityType: alias('layerGroup.layerVisibilityType'),

  /**
    Computed alias that returns a newly built mapbox layer object. Necessary to maintain state bindings.
    @property mapboxGlStyle
    @type Object
    @private
  */
  mapboxGlStyle: computed('style.{paint,layout,filter}', function () {
    return this.get('style');
  }),

  /**
    Getter and setter for filter. Array structure should follow Mapbox's [Expression](https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions) syntax.
    @property filter
    @type Array
  */
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

  /**
    Getter and setter for visibility. Mutates a Mapbox property that actually determines visibility. Depends on parent visibility.

    @property visibility
    @type Boolean
  */
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
