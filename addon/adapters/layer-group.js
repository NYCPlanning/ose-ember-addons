import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { getOwner } from '@ember/application';

const DEFAULT_HOST = 'https://layers-api.planninglabs.nyc';

export default class LayerGroupAdapter extends JSONAPIAdapter {
  constructor(...args) {
    super(...args);

    const { host = DEFAULT_HOST } =
      getOwner(this).resolveRegistration('config:environment')[
        'ember-mapbox-composer'
      ] || {};

    this.set('host', host);
    this.set('namespace', 'v1');
  }

  query(store, type, query = {}) {
    const URL = this.buildURL(type.modelName);

    return fetch(`${URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(query),
    }).then((blob) => blob.json());
  }
}
