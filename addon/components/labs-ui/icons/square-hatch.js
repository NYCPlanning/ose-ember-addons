import Component from '@glimmer/component';

export default class SquareHatchComponent extends Component {
  get backgroundColor() {
    this.args.options.backgroundColor || "rgba(0, 197, 255, 0.2)";
  }

  get hatchColor() {
    this.args.options.hatchColor || "rgba(0, 0, 0, 1)";
  }

  get hatchWidth() {
    this.args.options.hatchWidth || "0.5"
  }
}
