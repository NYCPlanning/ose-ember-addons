import Component from '@ember/component';
import layout from '../../templates/components/deprecated/site-header';

export default Component.extend({
  tagName: 'header',
  classNames: ['site-header'],

  layout,

  ariaRole: 'banner',

  closed: true,

  responsiveNav: false,

  responsiveSize: 'large',

  get betaNotice() {
    // Preserve backwards compatibility by defaulting to turning on beta notice
    return this.args.betaNotice || true;
  }
});
