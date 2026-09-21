import Component from '@glimmer/component';
import { get } from '@ember/object';

export default class NeedAsyncStateComponent extends Component {
  tagName = '';

  get isState() {
    return this.args.taskInstance && !!get(this.args.taskInstance, this.args.state);
  }
};
