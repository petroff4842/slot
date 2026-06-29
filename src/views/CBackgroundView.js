import { Assets, Container, Sprite, DisplacementFilter } from "pixi.js";

export class CBackgroundView extends Container {
  constructor(width, height) {
    super();
    this.areaWidth = width;
    this.areaHeight = height;
    this.bg = null;
    this.displacementSprite = null;
    this.displacementFilter = null;
  }

  async init() {
    const bgTexture = await Assets.load("/bg/bg.webp");
    this.bg = new Sprite(bgTexture);
    this.bg.anchor.set(0.5);
    this.addChild(this.bg);
    this.resize(this.areaWidth, this.areaHeight);

    const displacementTexture = await Assets.load("/filters/displacement.webp");

    this.displacementSprite = new Sprite(displacementTexture);
    this.displacementSprite.texture.source.addressMode = "repeat";
    this.displacementSprite.renderable = false;

    this.addChild(this.displacementSprite);

    this.displacementFilter = new DisplacementFilter({
      sprite: this.displacementSprite,
      scale: { x: 12, y: 12 },
    });

    this.filters = [this.displacementFilter];
    this.resize(this.areaWidth, this.areaHeight);
  }

  update(delta) {
    if (!this.displacementSprite) {
      return;
    }

    this.displacementSprite.x += 0.02 * delta;
    this.displacementSprite.y += 0.01 * delta;
  }

  resize(width, height) {
    this.areaWidth = width;
    this.areaHeight = height;

    if (!this.bg) {
      return;
    }

    const scale = Math.max(
      this.areaWidth / this.bg.texture.width,
      this.areaHeight / this.bg.texture.height,
    );

    this.bg.scale.set(scale);
    this.bg.x = this.areaWidth / 2;
    this.bg.y = this.areaHeight / 2;

    if (this.displacementSprite) {
      this.displacementSprite.width = this.areaWidth;
      this.displacementSprite.height = this.areaHeight;
    }
  }
}
