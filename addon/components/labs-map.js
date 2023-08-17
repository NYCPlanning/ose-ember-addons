import mapboxGlMap from 'ember-mapbox-gl/components/mapbox-gl';
import { assign } from '@ember/polyfills';
import { computed } from '@ember/object';

const highlightedCircleFeatureLayer = {
  id: 'highlighted-feature-circle',
  source: 'hovered-feature',
  type: 'circle',
  paint: {
    'circle-color': 'rgba(255, 255, 255, 0.65)',
    'circle-opacity': 1,
    'circle-radius': {
      stops: [
        [16, 3],
        [17, 6],
      ],
    },
    'circle-stroke-opacity': 0.8,
    'circle-stroke-color': '#ffff00',
    'circle-stroke-width': 2.5,
    'circle-pitch-scale': 'map',
  },
};

const highlightedLineFeatureLayer = {
  id: 'highlighted-feature-line',
  source: 'hovered-feature',
  type: 'line',
  paint: {
    'line-color': '#ffff00',
    'line-opacity': 0.3,
    'line-width': {
      stops: [
        [8, 4],
        [11, 7],
      ],
    },
  },
};

/**
  Extends `mapbox-gl` component to yield `labs-layers` contextual component. Allows passage of layer-groups.

  ```js
  // routes/application.js
  import Route from '@ember/routing/route';

  export default class ApplicationRoute extends Route {
    async model() {
      return this.store.query('layer-group');
    }
  }

  ```
  ```handlebars
  {{!-- routes/application.hbs --}}
  {{labs-map layerGroups=model}}
  ```

  @class LabsMapComponent
  @public
*/
export default mapboxGlMap.extend({
  init(...args) {
    this._super(...args);

    // if layerGroups are passed to the map, use the style from that
    if (this.layerGroups) {
      const {
        meta: { mapboxStyle },
      } = this.layerGroups || {};

      if (mapboxStyle) assign(this.initOptions || {}, { style: mapboxStyle });
    }
  },

  hoveredFeatureSource: computed('hoveredFeature', function () {
    const feature = this.hoveredFeature;

    return {
      type: 'geojson',
      data: feature,
    };
  }),

  hoveredFeature: null,
  highlightedCircleFeatureLayer,
  highlightedLineFeatureLayer,

  /**
    Collection of layer-group models (see: [DS.RecordArray](https://emberjs.com/api/ember-data/release/classes/DS.RecordArray)).
    Allows optional `meta` object with a `mapboxStyle` property which is passed to the mapbox-gl instance.
    @argument layerGroups
    @type DS.RecordArray
  */
  layerGroups: null,
});
