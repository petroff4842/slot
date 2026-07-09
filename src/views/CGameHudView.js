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

    this.balanceView = new CAmountTextView({
      label: "BALANCE",
      fontFamily: "HudFont",
      fontSize: 42,
    });
    this.addChild(this.balanceView);
  }

  resize(width, height) {
    this.balanceView.x = -width / 2 + 200;
    this.balanceView.y = -height / 2 + 50;
  }

  clearWin() {
    this.winView.complete();
    this.winView.clear();
  }

  setBalance(amount) {
    this.balanceView.setValue(amount);
  }

  countBalance(from, to) {
    this.balanceView.countFromTo(from, to, 1000);
  }

  countWin(amount, onComplete = null) {
    this.winView.countTo(amount, 2000, onComplete);
  }

  update(delta) {
    this.winView.update(delta);
    this.balanceView.update(delta);
  }
}
