import JSONAPISerializer from '@ember-data/serializer/json-api';
import { singularize } from 'ember-inflector';

export default class LayerGroupSerializer extends JSONAPISerializer {
  modelNameFromPayloadKey(key) {
    return singularize(super.modelNameFromPayloadKey(key));
  }
}
