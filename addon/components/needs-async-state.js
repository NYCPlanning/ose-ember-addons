import Component from '@glimmer/component';
import { computed, get } from '@ember/object';

export default class NeedAsyncStateComponent extends Component {
  tagName = '';
  isState = computed(
    'taskInstance.{isRunning,value,error}',
    'state',
    function () {
      return this.taskInstance && !!get(this.taskInstance, this.state);
    }
  );
};
