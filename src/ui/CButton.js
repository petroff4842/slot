import { Container, Assets, Sprite, Rectangle } from "pixi.js";

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

    const spinTexture = Assets.get("/ui/spin.png");
    this.spin = new Sprite(spinTexture);
    this.spin.anchor.set(0.5);
    this.spin.scale.set(0.6);
    this.spin.x = 0;
    this.spin.y = -2;
    this.addChild(this.spin);

    const stopTexture = Assets.get("/ui/stop.png");
    this.stop = new Sprite(stopTexture);
    this.stop.anchor.set(0.5);
    this.stop.scale.set(0.2);
    this.stop.x = 0;
    this.stop.y = -2;
    this.addChild(this.stop);

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
  }

  setState(isSpin = true) {
    this.spin.visible = isSpin;
    this.stop.visible = !isSpin;
  }

  setEnabled(enabled) {
    this.bg.tint = enabled ? 0xffffff : 0x999999;
    this.eventMode = enabled ? "static" : "none";
    this.cursor = enabled ? "pointer" : "default";
    this.alpha = enabled ? 1 : 0.6;
    this.spin.alpha = enabled ? 1 : 0.3;
    this.stop.alpha = enabled ? 1 : 0.3;
  }
}
