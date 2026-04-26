import { Container, Sprite, Assets } from "pixi.js";

export class CItemView extends Container {
  constructor(symbolScale = 1) {
    super();

    this.sprite = null;
    this.currentItem = null;
    this.symbolScale = symbolScale;
  }

  setItem(item) {
    if (this.currentItem === item) return;

    const texture = Assets.get(item.texture);

    if (!texture) {
      throw new Error(`Texture is not loaded: ${item.texture}`);
    }

    this.currentItem = item;

    if (!this.sprite) {
      this.sprite = new Sprite(texture);
      this.addChild(this.sprite);
    } else {
      this.sprite.texture = texture;
    }

    this.sprite.x = 0;
    this.sprite.y = 0;
    this.sprite.scale.set(this.symbolScale);
  }
}
