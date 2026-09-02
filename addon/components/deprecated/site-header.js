import Component from '@glimmer/component';
import layout from '../../templates/components/deprecated/site-header';

export default class SiteHeaderComponent extends Component {
  tagName = 'header';
  classNames = ['site-header'];

  layout = layout;

  ariaRole = 'banner';

  closed = true;

  responsiveNav = false;

  responsiveSize = 'large';

  betaNotice = function () {
    return this.args.betaNotice || false;
  };
};
