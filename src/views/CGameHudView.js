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
      fill: 0xffdd00,
      fontWeight: "bold",
    },
    chars: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ:., ",
  });

  isHudFontInstalled = true;
}

export class CGameHudView extends Container {
  constructor(config = {}) {
    super();
    installHudFont();

    this.config = config;

    this.winView = new CAmountTextView({
      label: "WIN",
      fontFamily: "HudFont",
      fontSize: 42,
    });

    this.winView.y = 230;

    this.addChild(this.winView);

    this.balanceView = new CAmountTextView({
      label: "BALANCE",
      fontFamily: "HudFont",
      fontSize: 42,
    });
    this.addChild(this.balanceView);

    this.betView = new CAmountTextView({
      label: "BET",
      fontFamily: "HudFont",
      fontSize: 42,
    });

    this.betView.x = -210;
    this.betView.y = 300;
    this.addChild(this.betView);
  }

  setBet(amount) {
    this.betView.setValue(amount);
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
    this.balanceView.countFromTo(
      from,
      to,
      this.config.balanceCountDuration,
    );
  }

  countWin(amount, onComplete = null) {
    this.winView.countTo(amount, this.config.winCountDuration, onComplete);
  }

  update(delta) {
    this.winView.update(delta);
    this.balanceView.update(delta);
  }
}
