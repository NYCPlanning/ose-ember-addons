import JSONAPIAdapter from '@ember-data/adapter/json-api';
import config from '../config/environment';

const { host } = config;

export default JSONAPIAdapter.extend({
  host,
  namespace: 'v1',
});
