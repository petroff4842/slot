import { Container } from "pixi.js";
import { CButton } from "../ui/CButton.js";
import { CSpinButton } from "../ui/CSpinButton.js";

export class CControlsView extends Container {
  constructor({
    reelHeight = 300,
    onSpinPress = null,
    onIncreaseBetPress = null,
    onDecreaseBetPress = null,
  } = {}) {
    super();

    this.spinButton = new CSpinButton({
      texturePath: "/ui/button.png",
      scale: 0.75,
      glowScale: 0.77,
      glowTint: 0xffdd00,
      onPress: onSpinPress,
    });

    const controlsY = reelHeight / 2 + 80;

    this.spinButton.x = 220;
    this.spinButton.y = controlsY;
    this.spinButton.setState(true);
    this.addChild(this.spinButton);

    this.decreaseBetButton = new CButton({
      texturePath: "/ui/minus.png",
      scale: 0.9,
      onPress: onDecreaseBetPress,
    });
    this.decreaseBetButton.y = controlsY;
    this.decreaseBetButton.x = -255;
    this.addChild(this.decreaseBetButton);

    this.increaseBetButton = new CButton({
      texturePath: "/ui/plus.png",
      scale: 0.9,
      onPress: onIncreaseBetPress,
    });
    this.increaseBetButton.y = controlsY;
    this.increaseBetButton.x = this.decreaseBetButton.x + this.decreaseBetButton.width + 10;
    this.addChild(this.increaseBetButton);
  }

  setSpinButtonState(isSpin) {
    this.spinButton.setState(isSpin);
  }

  setSpinButtonEnabled(enabled) {
    this.spinButton.setEnabled(enabled);
  }

  setIncreaseBetButtonEnabled(enabled) {
    this.increaseBetButton.setEnabled(enabled);
  }

  setDecreaseBetButtonEnabled(enabled) {
    this.decreaseBetButton.setEnabled(enabled);
  }

  setBetButtonsEnabled(enabled) {
    this.setIncreaseBetButtonEnabled(enabled);
    this.setDecreaseBetButtonEnabled(enabled);
  }
}