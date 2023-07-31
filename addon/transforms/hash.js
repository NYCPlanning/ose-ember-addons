import { Transform } from 'ember-data';
import EmberObject from '@ember/object';

export default class extends Transform {
  deserialize(serialized) {
    return EmberObject.create(serialized);
  }
}
