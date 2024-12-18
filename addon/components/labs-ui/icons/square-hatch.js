import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';

export default class SquareHatchComponent extends Component {
  get backgroundColor() {
    const backgroundColor = this.args?.options?.backgroundColor;
    return backgroundColor !== undefined
      ? htmlSafe(backgroundColor)
      : 'rgba(255, 255, 255, 1)';
  }

  get hatchColor() {
    const hatchColor = this.args?.options?.hatchColor;
    return hatchColor !== undefined ? htmlSafe(hatchColor) : 'rgba(0, 0, 0, 1)';
  }

  get hatchWidth() {
    const hatchWidth = this.args?.options?.hatchWidth;
    return hatchWidth !== undefined ? htmlSafe(hatchWidth) : '1';
  }
}
