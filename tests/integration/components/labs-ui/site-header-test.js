import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | labs-ui/site-header', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    // Template block usage:
    await render(hbs`
      <Deprecated::SiteHeader
        @responsiveNav={{true}}
        @responsiveSize="medium"
        @betaNotice={{true}}
        as |banner|
      >
        <banner.title>
          <a href="#" class="site-title">Foo</a>
        </banner.title>
        <banner.nav>
          <span class="bar">Bar</span>
        </banner.nav>
      </Deprecated::SiteHeader>
    `);

    // The beta notice renders
    const betaNotice = find('.labs-beta-notice').textContent.trim();
    assert.strictEqual(betaNotice, 'A beta project of NYC Planning Labs');

    // The DCP logo renders
    const dcpLinkIcon = await find('a.dcp-link img');
    assert.true(!!dcpLinkIcon);

    // The {{site-header-title}} contextual component renders
    const siteTitle = find('.site-title').textContent.trim();
    assert.strictEqual(siteTitle, 'Foo');

    // The {{site-header-nav}} contextual component renders
    const siteNav = find('.bar').textContent.trim();
    assert.strictEqual(siteNav, 'Bar');
  });
});
