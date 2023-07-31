import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | layer-group-toggle', function (hooks) {
  setupRenderingTest(hooks);

  test('it opens and closes on click', async function (assert) {
    await render(
      hbs`<Deprecated::LayerGroupToggle @label="Foo" @active={{true}} >Bar</Deprecated::LayerGroupToggle>`
    );
    await click('.layer-group-toggle-label');
    const content = find('.layer-group-toggle-content');
    assert.false(!!content);

    await click('.layer-group-toggle-label');
    const content2 = find('.layer-group-toggle-content');
    assert.true(!!content2);
  });

  test('it yields content when open', async function (assert) {
    await render(
      hbs`<Deprecated::LayerGroupToggle @label="Foo" @active={{true}} >Bar</Deprecated::LayerGroupToggle>`
    );
    const content = find('.layer-group-toggle-content').textContent.trim();
    assert.strictEqual(content, 'Bar');
  });

  test('it shows a title', async function (assert) {
    await render(hbs`<Deprecated::LayerGroupToggle @label="Foo" />`);
    const title = await find(
      '.layer-group-toggle-header .layer-group-toggle-label'
    ).textContent.trim();
    assert.strictEqual(title, 'Foo');
  });

  test('accepts a for property to lookup an object', async function (assert) {
    await render(hbs`<Deprecated::LayerGroupToggle @label="Foo" />`);
    const title = await find(
      '.layer-group-toggle-header .layer-group-toggle-label'
    ).textContent.trim();
    assert.strictEqual(title, 'Foo');
  });
});
