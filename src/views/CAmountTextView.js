import { BitmapText, Container } from "pixi.js";

export class CAmountTextView extends Container {
  constructor({ label, fontFamily = "HudFont", fontSize = 42 }) {
    super();

    this.label = label;
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;

    this.currentValue = 0;
    this.targetValue = 0;
    this.countSpeed = 0;
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
    this.countSpeed = 0;
    this.isCounting = false;

    this.text.text = `${this.label}: ${this.currentValue}`;
  }

  clear() {
    this.setValue(0);
  }

  countTo(value, duration = 1000) {
    this.currentValue = 0;
    this.targetValue = value;
    this.isCounting = value > 0;
    this.countSpeed = duration > 0 ? value / duration : value;

    this.text.text = `${this.label}: 0`;

    if (!this.isCounting) {
      this.setValue(value);
    }
  }

  update(delta) {
    if (!this.isCounting) {
      return;
    }

    const nextValue = Math.min(
      this.targetValue,
      this.currentValue + this.countSpeed * delta,
    );
    const displayValue = Math.floor(nextValue);

    if (displayValue !== Math.floor(this.currentValue)) {
      this.text.text = `${this.label}: ${displayValue}`;
    }

    this.currentValue = nextValue;

    if (this.currentValue >= this.targetValue) {
      this.setValue(this.targetValue);
    }
  }
}
