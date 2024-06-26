import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | labs-layers-tooltip', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.set('mousePosition', {
      x: 1,
      y: 1,
    });

    await render(
      hbs`<LabsLayersTooltip @mousePosition={{this.mousePosition}} @top={{1}} @left={{1}} />`
    );

    assert.strictEqual(this.element.textContent.trim(), '');

    // Template block usage:
    await render(
      hbs`<LabsLayersTooltip @mousePosition={{this.mousePosition}} @top={{1}} @left={{1}}>template block text</LabsLayersTooltip>`
    );

    assert.strictEqual(this.element.textContent.trim(), 'template block text');
  });

  test('it generates correct markup', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.set('mousePosition', {
      x: 1,
      y: 1,
    });

    await render(
      hbs`<LabsLayersTooltip @mousePosition={{this.mousePosition}} @top={{1}} @left={{1}} />`
    );

    const tooltip = await find('.map-tooltip');
    assert.strictEqual(getComputedStyle(tooltip)['top'], '21px');
    assert.strictEqual(getComputedStyle(tooltip)['left'], '21px');
  });
});
