import Model, { attr } from '@ember-data/model';

/**
  Model for related sources

  @public
  @class SourceModel
*/
export default Model.extend({
  meta: attr(),
});
