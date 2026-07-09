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
    this.countDirection = 1;
    this.isCounting = false;
    this.onComplete = null;

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
    this.countDirection = 1;

    this.text.text = `${this.label}: ${this.currentValue}`;
  }

  complete() {
    if (!this.isCounting) {
      return;
    }

    this.setValue(this.targetValue);

    const onComplete = this.onComplete;
    this.onComplete = null;

    if (onComplete) {
      onComplete();
    }
  }

  clear() {
    this.setValue(0);
  }

  countTo(value, duration = 1000, onComplete = null) {
    this.currentValue = 0;
    this.targetValue = value;
    this.isCounting = value > 0;
    this.countSpeed = duration > 0 ? value / duration : value;
    this.onComplete = onComplete;

    this.text.text = `${this.label}: 0`;

    if (!this.isCounting) {
      this.setValue(value);
    }
  }

  countFromTo(from, to, duration = 1000, onComplete = null) {
    this.currentValue = from;
    this.targetValue = to;
    const distance = to - from;
    this.isCounting = distance !== 0;
    this.countDirection = Math.sign(distance) || 1;

    this.countSpeed = duration > 0 ? Math.abs(distance) / duration : Math.abs(distance);
    this.onComplete = onComplete;

    this.text.text = `${this.label}: ${Math.floor(from)}`;

    if (!this.isCounting) {
      this.setValue(to);
    }
  }

  update(delta) {
    if (!this.isCounting) {
      return;
    }

    const nextValue =
      this.currentValue + this.countSpeed * delta * this.countDirection;
    const displayValue = Math.floor(nextValue);

    if (displayValue !== Math.floor(this.currentValue)) {
      this.text.text = `${this.label}: ${displayValue}`;
    }

    this.currentValue = nextValue;

    const isComplete =
      this.countDirection > 0
        ? this.currentValue >= this.targetValue
        : this.currentValue <= this.targetValue;

    if (isComplete) {
      this.complete();
    }
  }
}
