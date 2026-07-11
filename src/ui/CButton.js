import { Container, Assets, Sprite, Rectangle } from "pixi.js";

export class CButton extends Container {
  constructor({ texturePath = "/ui/button.png", scale = 0.8, glowScale = 0.815, glowTint = 0xffdd00, onPress = null } = {}) {
    super();

    const texture = Assets.get(texturePath);
    this.glow = new Sprite(texture);
    this.glow.anchor.set(0.5);
    this.glow.scale.set(glowScale);
    this.glow.tint = glowTint;
    this.glow.alpha = 0;
    this.addChild(this.glow);

    this.bg = new Sprite(texture);
    this.bg.anchor.set(0.5);
    this.bg.scale.set(scale);
    this.addChild(this.bg);

    const hitWidth = this.bg.width * 0.9;
    const hitHeight = this.bg.height * 0.5;

    this.hitArea = new Rectangle(
      -hitWidth / 2,
      -hitHeight / 2,
      hitWidth,
      hitHeight,
    );

    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointerover", () => {
      this.glow.alpha = 1;
    });

    this.on("pointerout", () => {
      this.glow.alpha = 0;
    });

    this.on("pointerdown", () => {
      this.scale.set(0.9);
      this.glow.alpha = 0;
      setTimeout(() => {
        this.scale.set(1);
      }, 100);
    });

    this.onPress = onPress;

    this.on("pointerup", () => {
      if (this.onPress) {
        this.onPress();
      }
    });
  }

  setEnabled(enabled) {
    this.bg.tint = enabled ? 0xffffff : 0x999999;
    this.eventMode = enabled ? "static" : "none";
    this.cursor = enabled ? "pointer" : "default";
    this.alpha = enabled ? 1 : 0.6;
  }
}
