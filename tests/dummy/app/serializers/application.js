import JSONAPISerializer from '@ember-data/serializer/json-api';
import { singularize } from 'ember-inflector';

export default class ApplicationSerializer extends JSONAPISerializer {
  modelNameFromPayloadKey(key) {
    return singularize(super.modelNameFromPayloadKey(key));
  }

  payloadKeyFromModelName(modelName) {
    // mirror on the way out, in case anything does createRecord/updateRecord
    return `${modelName}s`;
  }
}
