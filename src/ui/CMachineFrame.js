import { Container, Graphics } from "pixi.js";

export class CMachineFrame extends Container {
  constructor(width, height, padding = 20) {
    super();

    this.widthValue = width;
    this.heightValue = height;
    this.padding = padding;

    this.bg = new Graphics();
    this.addChild(this.bg);

    this.draw();
  }

  draw() {
    this.bg.clear();

    const w = this.widthValue;
    const h = this.heightValue;
    const p = this.padding;

    this.bg
      .roundRect(-w / 2 - p, -p, w + p * 2, h + p * 2, 20)
      .fill({ color: 0x222222 })
      .stroke({ width: 4, color: 0xffffff });
  }
}
