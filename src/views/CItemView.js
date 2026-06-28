import { Container, Sprite, Assets } from "pixi.js";

export class CItemView extends Container {
  constructor(symbolScale = 1) {
    super();

    this.sprite = null;
    this.currentItem = null;
    this.symbolScale = symbolScale;
    this.isWinAnimating = false;
    this.winAnimationElapsed = 0;
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
      this.sprite.anchor.set(0.5);
      this.addChild(this.sprite);
    } else {
      this.sprite.texture = texture;
    }

    this.sprite.x = texture.width * this.symbolScale * 0.5;
    this.sprite.y = texture.height * this.symbolScale * 0.5;

    this.sprite.scale.set(this.symbolScale);
  }

  startWinAnimation() {
    this.isWinAnimating = true;
    this.winAnimationElapsed = 0;
  }

  stopWinAnimation() {
    this.isWinAnimating = false;
    this.winAnimationElapsed = 0;

    if (this.sprite) {
      this.sprite.alpha = 1;
      this.sprite.scale.set(this.symbolScale);
    }
  }

  updateWinAnimation(delta) {
    if (!this.isWinAnimating || !this.sprite) {
      return;
    }

    this.winAnimationElapsed += delta;

    const pulse = (Math.sin(this.winAnimationElapsed / 120) + 1) / 2;
    const scale = this.symbolScale * (1 + pulse * 0.12);

    this.sprite.scale.set(scale);
    this.sprite.alpha = 0.75 + pulse * 0.25;
  }
}
