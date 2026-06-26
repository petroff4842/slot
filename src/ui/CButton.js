import { Container, Text, Assets, Sprite, Rectangle } from "pixi.js";

export class CButton extends Container {
  constructor(labelText = "BUTTON") {
    super();

    const texture = Assets.get("/ui/button.png");

    this.glow = new Sprite(texture);
    this.glow.anchor.set(0.5);
    this.glow.scale.set(0.815);
    this.glow.tint = 0xffdd00;
    this.glow.alpha = 0;
    this.addChild(this.glow);

    this.bg = new Sprite(texture);
    this.bg.anchor.set(0.5);
    this.bg.scale.set(0.8);
    this.addChild(this.bg);

    const hitWidth = this.bg.width * 0.9;
    const hitHeight = this.bg.height * 0.5;

    this.hitArea = new Rectangle(
      -hitWidth / 2,
      -hitHeight / 2,
      hitWidth,
      hitHeight,
    );

    this.label = new Text({
      text: labelText,
      style: {
        fill: "#ffffff",
        fontSize: 20,
      },
    });

    this.label.anchor.set(0.5);
    this.label.x = 0;
    this.label.y = 0;

    this.addChild(this.label);

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
  }

  setText(text) {
    this.label.text = text;
  }

  setEnabled(enabled) {
    this.bg.tint = enabled ? 0xffffff : 0x999999;
    this.eventMode = enabled ? "static" : "none";
    this.cursor = enabled ? "pointer" : "default";
    this.alpha = enabled ? 1 : 0.6;
  }
}
