import { BitmapText, Container } from "pixi.js";

export class CAmountTextView extends Container {
  constructor({ label, fontFamily = "HudFont", fontSize = 42 }) {
    super();

    this.label = label;
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;

    this.currentValue = 0;
    this.targetValue = 0;
    this.elapsed = 0;
    this.duration = 1000;
    this.isCounting = false;

    this.text = new BitmapText({
      text: `${this.label}: 0`,
      style: {
        fontFamily: this.fontFamily,
        fontSize: this.fontSize,
      },
    });
    this.text.anchor.set(0.5);
    this.addChild(this.text);
  }

  setValue(value) {
    this.currentValue = value;
    this.targetValue = value;
    this.elapsed = 0;
    this.isCounting = false;

    this.text.text = `${this.label}: ${this.currentValue}`;
  }

  clear() {
    this.setValue(0);
  }

  countTo(value, duration = 1000) {
    this.currentValue = 0;
    this.targetValue = value;
    this.elapsed = 0;
    this.duration = duration;
    this.isCounting = value > 0;

    this.text.text = `${this.label}: 0`;

    if (!this.isCounting) {
      this.setValue(value);
    }
  }

  update(delta) {
    if (!this.isCounting) {
      return;
    }

    this.elapsed += delta;

    const progress = Math.min(1, this.elapsed / this.duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const nextValue = Math.floor(this.targetValue * eased);

    if (nextValue !== this.currentValue) {
      this.currentValue = nextValue;
      this.text.text = `${this.label}: ${this.currentValue}`;
    }

    if (progress >= 1) {
      this.setValue(this.targetValue);
    }
  }
}
