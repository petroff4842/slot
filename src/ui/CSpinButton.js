import { Assets, Sprite } from "pixi.js";
import { CButton } from "./CButton.js";

export class CSpinButton extends CButton {
  constructor({ texturePath = "/ui/button.png", scale = 0.8, glowScale = 0.815, glowTint = 0xffdd00, onPress = null } = {}) {
    super({ texturePath, scale, glowScale, glowTint, onPress });
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

    this.setState(true);
  }

  setState(isSpin = true) {
    this.spin.visible = isSpin;
    this.stop.visible = !isSpin;
  }

  setEnabled(enabled) {
    super.setEnabled(enabled);
    this.spin.alpha = enabled ? 1 : 0.3;
    this.stop.alpha = enabled ? 1 : 0.3;
  }
}