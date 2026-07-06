import { BitmapFont, Container } from "pixi.js";
import { CAmountTextView } from "./CAmountTextView.js";

let isHudFontInstalled = false;

function installHudFont() {
  if (isHudFontInstalled) {
    return;
  }

  BitmapFont.install({
    name: "HudFont",
    style: {
      fontFamily: "Arial",
      fontSize: 48,
      fill: 0xffdd55,
      fontWeight: "bold",
    },
    chars: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ:., ",
  });

  isHudFontInstalled = true;
}

export class CGameHudView extends Container {
  constructor() {
    super();
    installHudFont();

    this.winView = new CAmountTextView({
      label: "WIN",
      fontFamily: "HudFont",
      fontSize: 42,
    });

    this.winView.y = 300;

    this.addChild(this.winView);
  }

  clearWin() {
    this.winView.clear();
  }

  countWin(amount) {
    this.winView.countTo(amount, 2000);
  }

  update(delta) {
    this.winView.update(delta);
  }
}
