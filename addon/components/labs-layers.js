import Component from '@ember/component';
import { computed, get } from '@ember/object';
import turfUnion from '@turf/union';
import ArrayProxy from '@ember/array/proxy';
import { warn } from '@ember/debug';

/**
  Renders a collection of Mapbox Composer-compatible layer groups.

  ```js
  // routes/application.js
  import Route from '@ember/routing/route';

  export default class ApplicationRoute extends Route {
    async model() {
      return [{
        id: 'roads',
        layers: [{
          id: 'highways',
          style: {
            type: 'line',
            paint: {
              'line-fill': 'orange',
            },
          },
        }, {
          id: 'streets',
          style: {
            type: 'line',
            paint: {
              'line-fill': 'blue',
            },
          },
        }]
      }];
    }
  }

  ```
  ```handlebars
  {{!-- routes/application.hbs --}}
  {{#labs-map as |map|}}
    {{map.labs-layers layerGroups=model}}
  {{/labs-map}}
  ```

  @class LayersComponent
  @public
*/
export default Component.extend({
  /**
    Reference to a instance of a MapboxGL map. Handled internally when using contextual components:

    ```
  {{#labs-map as |map|}}
    {{map.labs-layers layerGroups=model}}
  {{/labs-map}}
    ```
    @argument map
    @private
    @type MapboxGL Map Instance
  */
  map: null,

  /**
    Whether layergroups should have interactivity (highlighting and clicking).  Useful for temporarily disabling interactivity during drawing mode.

    @argument interactivity
    @type boolean
  */
  interactivity: true,

  /**
    Collection of layer-group objects
    @argument layerGroups
    @type Array
  */
  layerGroups: null,

  /**
    Event fired on layer click. Scoped to individual layers. Returns the mouse event and clicked layer.
    @argument onLayerClick
    @type Action
  */
  onLayerClick() {},

  /**
    Event fired on layer mousemove. Scoped to individual layers. Returns the mouse event and found layer.
    @argument onLayerMouseMove
    @type Action
  */
  onLayerMouseMove() {},

  /**
    Event fired on layer mouseleave. Scoped to individual layers. Returns the mouse event and found layer.
    @argument onLayerMouseLeave
    @type Action
  */
  onLayerMouseLeave() {},

  /**
    Event fired on layer highlight. Returns the id of the layer that is being highlighted.
    @argument onLayerHighlight
    @type Action
  */
  onLayerHighlight() {},

  /**
    Name of local component to use in place of default component.
    @argument toolTipComponent
    @type String
  */
  toolTipComponent: 'labs-layers-tooltip',

  hoveredFeature: null,

  hoveredLayer: computed('hoveredFeature', 'layers', function () {
    const feature = this.hoveredFeature;

    if (feature) {
      return this.layers.findBy('id', feature.layer.id);
    }

    return null;
  }),

  layers: computed('layerGroups.@each.layers', function () {
    return ArrayProxy.create({
      content: this.get('layerGroups')
        .map((layerGroup) => get(layerGroup, 'layers'))
        .reduce((accumulator, current) => {
          const layers = current.toArray();

          return [...accumulator, ...layers];
        }, []),
    });
  }),

  interactiveLayerIds: computed('layers.@each.visibility', function () {
    return this.layers
      .filterBy('visibility', true)
      .filter(
        ({ highlightable, tooltipable, clickable }) =>
          highlightable || tooltipable || clickable
      )
      .map((layer) => layer.get('id'));
  }),

  mousePosition: null,

  stitchHoveredTiles(feature) {
    const map = this.map;

    warn(
      `Missing ID in properties for ${feature.layer.source}`,
      feature.properties.id,
      {
        id: 'ember-mapbox-composer.id-missing',
      }
    );

    // require an id for stitching
    if (!feature.properties.id) return feature;

    // query for features by source
    const featureFragments = map
      .querySourceFeatures(feature.layer.source, {
        sourceLayer: feature.layer['source-layer'],
        filter: ['==', 'id', feature.properties.id],
      })
      .map(({ geometry, properties }) => ({
        type: 'Feature',
        properties,
        geometry,
      }));

    // we don't need to union if there is only one
    // we also don't want to slow down machines if there are too many
    if (featureFragments.length === 1 || featureFragments.length > 100)
      return feature;
    // if the fragments are features of type "Point", return the first one instead of unioning
    if (
      featureFragments.length > 0 &&
      featureFragments[0].geometry.type === 'Point'
    )
      return featureFragments[0];
    return featureFragments.reduce((acc, curr) =>
      turfUnion(curr, acc ? acc : curr)
    );
  },

  actions: {
    async handleLayerMouseClick(e) {
      // TODO: stitch clicked feature
      const {
        features: [feature],
      } = e;
      const interactivity = this.interactivity;

      const foundLayer = this.layers.findBy('id', feature.layer.id);
      const layerClickEvent = this.onLayerClick;

      if (layerClickEvent && feature && interactivity) {
        const { geometry } = this.stitchHoveredTiles(feature);
        feature.geometry = geometry;

        layerClickEvent(feature, foundLayer);
      }
    },

    async handleLayerMouseMove(e) {
      // only query the visible layers
      const layerIds = this.interactiveLayerIds;
      const [feature] = this.map.queryRenderedFeatures(e.point, {
        layers: layerIds,
      });
      if (!feature) return;

      const map = this.map;
      const interactivity = this.interactivity;

      const foundLayer = this.layers.findBy('id', feature.layer.id);

      // this layer-specific event should always be called
      // if it's available
      const mouseMoveEvent = this.onLayerMouseMove;
      mouseMoveEvent(e, foundLayer);

      const { highlightable, tooltipable, clickable } =
        foundLayer.getProperties('highlightable', 'tooltipable', 'clickable');

      if (clickable) {
        map.getCanvas().style.cursor = 'pointer';
      }

      // if layer is set for this behavior
      if ((highlightable || tooltipable) && interactivity) {
        const hoveredFeature = this.hoveredFeature;
        let isNew = true;
        if (hoveredFeature) {
          if (
            feature.properties.id === hoveredFeature.properties.id &&
            feature.layer.id === hoveredFeature.layer.id
          ) {
            isNew = false;
          }
        }

        if (isNew) {
          const highlightEvent = this.onLayerHighlight;
          // if this is different from the currently highlighted feature
          highlightEvent(e, foundLayer);

          // only stitch if it's for highlighting and new
          // query for features of a given source
          const { geometry } = this.stitchHoveredTiles(feature);
          feature.geometry = geometry;

          // set the hovered feature
          this.set('hoveredFeature', feature);

          map.getSource('hovered-feature').setData(feature);

          if (feature.layer.type == 'circle') {
            map.setLayoutProperty(
              'highlighted-feature-circle',
              'visibility',
              'visible'
            );
            map.setLayoutProperty(
              'highlighted-feature-line',
              'visibility',
              'none'
            );
          } else {
            map.setLayoutProperty(
              'highlighted-feature-circle',
              'visibility',
              'none'
            );
            map.setLayoutProperty(
              'highlighted-feature-line',
              'visibility',
              'visible'
            );
          }
        }
      }

      this.set('mousePosition', e.point);
    },

    handleLayerMouseLeave() {
      const map = this.map;
      this.set('hoveredFeature', null);
      map.getCanvas().style.cursor = '';
      this.setProperties({
        hoveredFeature: null,
        mousePosition: null,
      });

      map.setLayoutProperty('highlighted-feature-circle', 'visibility', 'none');
      map.setLayoutProperty('highlighted-feature-line', 'visibility', 'none');

      const mouseLeaveEvent = this.onLayerMouseLeave;

      if (mouseLeaveEvent) {
        mouseLeaveEvent();
      }
    },
  },
});
