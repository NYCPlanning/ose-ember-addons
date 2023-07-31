import Transform from '@ember-data/serializer/transform';
import EmberObject from '@ember/object';

export default class extends Transform {
  deserialize(serialized) {
    return EmberObject.create(serialized);
  }
}
