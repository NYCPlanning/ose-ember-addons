import { module, test } from 'qunit';
import { settled } from '@ember/test-helpers';
import { setupTest } from 'ember-qunit';

module('Unit | Service | layer-groups', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let service = this.owner.lookup('service:layer-groups');

    assert.ok(service);
  });

  test('it lists visibleLayerGroups when none loaded', function (assert) {
    let service = this.owner.lookup('service:layer-groups');

    assert.strictEqual(service.get('visibleLayerGroups').length, 0);
  });

  test('can initialize with initializeObservers', function (assert) {
    let store = this.owner.lookup('service:store');
    let service = this.owner.lookup('service:layer-groups');

    store.push({
      data: [
        { type: 'layer-group', id: 1, attributes: { visible: true } },
        { type: 'layer-group', id: 2, attributes: { visible: true } },
        { type: 'layer-group', id: 3, attributes: { visible: false } },
      ],
    });

    service.initializeObservers(store.peekAll('layer-group'));

    assert.ok(service);
  });

  test('it lists visibleLayerGroups when some visible', function (assert) {
    let service = this.owner.lookup('service:layer-groups');
    let store = this.owner.lookup('service:store');

    store.push({
      data: [
        { type: 'layer-group', id: 1, attributes: { visible: true } },
        { type: 'layer-group', id: 2, attributes: { visible: true } },
        { type: 'layer-group', id: 3, attributes: { visible: false } },
      ],
    });

    const layerGroups = store.peekAll('layer-group');

    service.initializeObservers(layerGroups);

    assert.strictEqual(service.get('visibleLayerGroups').length, 2);
  });

  test('it updates state based on visibility', async function (assert) {
    let service = this.owner.lookup('service:layer-groups');
    let store = this.owner.lookup('service:store');

    store.push({
      data: [
        {
          type: 'layer-group',
          id: 1,
          attributes: {
            visible: true,
            'layer-visibility-type': 'binary',
          },
        },
        {
          type: 'layer-group',
          id: 2,
          attributes: {
            visible: true,
            'layer-visibility-type': 'binary',
          },
        },
        {
          type: 'layer-group',
          id: 3,
          attributes: {
            visible: false,
            'layer-visibility-type': 'binary',
          },
        },
      ],
    });

    const layerGroups = store.peekAll('layer-group');

    service.initializeObservers(layerGroups);

    assert.strictEqual(service.get('visibleLayerGroups').length, 2);

    layerGroups[0].set('visible', false);

    await settled();

    assert.strictEqual(service.get('visibleLayerGroups').length, 1);
  });

  test('it updates substate based on filter, selection', function (assert) {
    let service = this.owner.lookup('service:layer-groups');
    let store = this.owner.lookup('service:store');

    store.push({
      data: [
        {
          type: 'layer-group',
          id: 1,
          attributes: {
            visible: true,
            'layer-visibility-type': 'singleton',
          },
          relationships: [
            {
              type: 'layer',
              id: 1,
            },
          ],
        },
        {
          type: 'layer-group',
          id: 2,
          attributes: {
            visible: true,
            'layer-visibility-type': 'binary',
          },
        },
        {
          type: 'layer-group',
          id: 3,
          attributes: {
            visible: false,
            'layer-visibility-type': 'binary',
          },
        },
      ],
      included: [
        {
          type: 'layer',
          id: 1,
          attributes: {},
        },
      ],
    });

    const layerGroups = store.peekAll('layer-group');

    service.initializeObservers(layerGroups);

    assert.strictEqual(service.get('visibleLayerGroups').length, 2);

    assert.notStrictEqual(typeof service.get('visibleLayerGroups'), 'string');
  });
});
