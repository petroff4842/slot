import { Container } from "pixi.js";
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
      scale: 0.8,
      glowScale: 0.815,
      glowTint: 0xffdd00,
      onPress: onSpinPress,
    });

    this.spinButton.y = reelHeight / 2 + 80;
    this.spinButton.setState(true);
    this.addChild(this.spinButton);
  }

  setSpinButtonState(isSpin) {
    this.spinButton.setState(isSpin);
  }

  setSpinButtonEnabled(enabled) {
    this.spinButton.setEnabled(enabled);
  }
}