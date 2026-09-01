// BEGIN-SNIPPET layer-group-route.js
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service store;

  model() {
    return this.store.query('layer-group', {
      'layer-groups': ['tax-lots', 'subway'],
    });
  }
}
// END-SNIPPET
