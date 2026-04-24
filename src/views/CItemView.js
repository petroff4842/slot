import { Container, Sprite, Assets } from "pixi.js";

export class CItemView extends Container {
  constructor() {
    super();

    this.sprite = null;
    this.currentItem = null;
  }

  async update(item) {
    if (this.currentItem === item) return;
    this.currentItem = item;

    const texture = await Assets.load(item.texture);

    if (!this.sprite) {
      this.sprite = new Sprite(texture);
      this.addChild(this.sprite);
    } else {
      this.sprite.texture = texture;
    }

    this.sprite.x = 0;
    this.sprite.y = 0;
    this.sprite.scale.set(1.5);
  }
}
