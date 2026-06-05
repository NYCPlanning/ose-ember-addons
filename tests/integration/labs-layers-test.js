import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import ArrayProxy from '@ember/array/proxy';
import createMap from '../helpers/create-map';

module('Integration | Component | labs-layers', function (hooks) {
  hooks.beforeEach(function () {
    this.afterAfter = function () {
      this.map.remove();
      this.layer = null;
    };
  });

  hooks.beforeEach(async function () {
    this.map = await createMap();
    this.layer = null;
  });

  setupRenderingTest(hooks);

  skip('changes to model filter mutate mapbox state', async function (assert) {
    let store = this.owner.lookup('service:store');

    await this.map.addSource('filter-test', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-76.53063297271729, 39.18174077994108],
        },
      },
    });

    this.layer = store.createRecord('layer', {
      style: {
        id: 'rveilqbyveqpivhbeq',
        type: 'circle',
        filter: ['==', '$type', 'Point'],
        source: 'filter-test',
      },
    });

    this.set('map', this.map);

    this.set('model', {
      sources: [],
      layerGroups: [
        {
          layers: [this.layer],
        },
      ],
    });

    await render(
      hbs`<LabsLayers @layerGroups={{this.model.layerGroups}} @map={{this.map}} />`
    );

    assert.deepEqual(
      this.map.getFilter(this.layer.get('style.id')),
      this.layer.get('filter'),
      'filter was set'
    );

    this.layer.set('filter', ['!=', '$type', 'LineString']);

    await settled();

    assert.deepEqual(
      this.map.getFilter(this.layer.get('style.id')),
      this.layer.get('filter'),
      'filter was set'
    );

    assert.deepEqual(
      this.map.getFilter(this.layer.get('style.id')),
      ['!=', '$type', 'LineString'],
      'filter was set'
    );
  });

  test('changes to model paint mutate mapbox state', async function (assert) {
    let store = this.owner.lookup('service:store');

    this.layer = store.createRecord('layer', {
      style: {
        id: 'u3qfgoljknjklm',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-76.53063297271729, 39.18174077994108],
            },
          },
        },
        paint: {
          'circle-color': 'white',
        },
      },
    });

    this.set('map', this.map);

    this.set('model', {
      layerGroups: [
        {
          layers: ArrayProxy.create({ content: [this.layer] }),
        },
      ],
    });

    await render(
      hbs`<LabsLayers @layerGroups={{this.model.layerGroups}} @map={{this.map}} />`
    );

    assert.strictEqual(
      this.map.getPaintProperty(this.layer.get('style.id'), 'circle-color'),
      'white',
      'paint property was set'
    );
  });

  test('subsequent updates from server are honored', async function (assert) {
    let store = this.owner.lookup('service:store');

    store.push({
      data: {
        type: 'layer',
        id: 'test-layer',
        attributes: {
          style: {
            id: 'u3qfgoljknjklm',
            type: 'circle',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [-76.53063297271729, 39.18174077994108],
                },
              },
            },
            paint: {
              'circle-color': 'white',
            },
          },
        },
      },
    });

    this.layer = store.peekRecord('layer', 'test-layer');

    this.set('map', this.map);

    this.set('model', {
      layerGroups: [
        {
          layers: ArrayProxy.create({ content: [this.layer] }),
        },
      ],
    });

    await render(
      hbs`<LabsLayers @layerGroups={{this.model.layerGroups}} @map={{this.map}} />`
    );

    assert.strictEqual(
      this.map.getPaintProperty(this.layer.get('style.id'), 'circle-color'),
      'white',
      'paint property was set'
    );

    store.push({
      data: {
        type: 'layer',
        id: 'test-layer',
        attributes: {
          style: {
            id: 'u3qfgoljknjklm',
            type: 'circle',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [-76.53063297271729, 39.18174077994108],
                },
              },
            },
            paint: {
              'circle-color': 'black',
            },
          },
        },
      },
    });

    await settled();

    assert.strictEqual(
      this.map.getPaintProperty(this.layer.get('style.id'), 'circle-color'),
      'black',
      'paint property was updated from server'
    );
  });
});
