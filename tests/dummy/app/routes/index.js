// BEGIN-SNIPPET layer-group-route.js
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  store: service(),

  model() {
    return this.store.query('layer-group', {
      'layer-groups': ['tax-lots', 'subway'],
    });
  },
});
// END-SNIPPET
