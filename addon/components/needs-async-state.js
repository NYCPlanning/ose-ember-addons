import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({
  tagName: '',
  isState: computed('taskInstance.{isRunning,value,error}', 'state', function() {
    return this.taskInstance && !!get(this.taskInstance, this.state);
  })
});
