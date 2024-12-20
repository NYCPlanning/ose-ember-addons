import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';

export default class SquareHatchComponent extends Component {
  get backgroundColor() {
    const { backgroundColor } = this.agrs.options;
    return backgroundColor !== undefined ? htmlSafe(backgroundColor) :  "rgba(0, 197, 255, 0.2)";
  }

  get hatchColor() {
    const { hatchColor } = this.agrs.options;
    return hatchColor !== undefined ? htmlSafe(hatchColor) : "rgba(0, 0, 0, 1)";
  }

  get hatchWidth() {
    const { hatchWidth } = this.agrs.options;
    return hatchWidth !== undefined ? htmlSafe(hatchWidth) : "0.5";
  }
}
