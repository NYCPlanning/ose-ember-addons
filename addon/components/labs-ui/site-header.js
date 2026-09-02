import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class SiteHeaderComponent extends Component {
  @tracked closed = true;

  get responsiveNav() {
    return this.args.responsiveNav || false;
  }

  get responsiveSize() {
    return this.args.responsiveSize || 'large';
  }

  get betaNotice() {
    return this.args.betaNotice || false;
  }

  @action
  toggleClosed() {
    this.closed = !this.closed;
  }
}
