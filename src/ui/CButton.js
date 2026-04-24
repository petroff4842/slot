import { Container, Graphics, Text } from "pixi.js";

export class CButton extends Container {
  constructor(labelText = "BUTTON") {
    super();

    this.bg = new Graphics();
    this.bg.roundRect(0, 0, 150, 50, 10).fill({ color: 0x00aa00 });

    this.addChild(this.bg);

    this.label = new Text({
      text: labelText,
      style: {
        fill: "#ffffff",
        fontSize: 20,
      },
    });

    this.label.anchor.set(0.5);
    this.label.x = 75;
    this.label.y = 25;

    this.addChild(this.label);

    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointerover", () => {
      this.bg.tint = 0x66cc66;
    });

    this.on("pointerout", () => {
      this.bg.tint = 0xffffff;
    });

    this.on("pointerdown", () => {
      this.bg.tint = 0x999999;
    });

    this.on("pointerup", () => {
      this.bg.tint = 0xffffff;
    });
  }

  setText(text) {
    this.label.text = text;
  }

  setEnabled(enabled) {
    this.eventMode = enabled ? "static" : "none";
    this.cursor = enabled ? "pointer" : "default";
    this.alpha = enabled ? 1 : 0.6;
  }
}
