import { Container, Graphics } from "pixi.js";
import { CItemView } from "./CItemView";

export class CReelView extends Container {
  constructor(sequence, config) {
    super();
    this.sequence = sequence;
    this.config = config;
    this.itemViews = [];
    this.contentOffset = 0;
    this.startY = 0;
    this.itemHeight = null;
    this.totalHeight = 0;
    this.isSpinning = false;
    this.isStopping = false;
    this.stopTargetOffset = 0;

    this.stopStartOffset = 0;
    this.stopElapsed = 0;
    this.stopDuration = this.config.stopDuration;
  }

  async init() {
    for (let i = 0; i < 8; i++) {
      const item = this.sequence.at(i);

      const itemView = new CItemView();
      await itemView.update(item);

      if (this.itemHeight == null) {
        this.itemHeight = itemView.height;
      }

      itemView.x = 0;
      itemView.y = i * this.itemHeight;

      this.itemViews.push(itemView);
      this.addChild(itemView);
    }

    const first = this.itemViews[0];

    const mask = new Graphics();
    mask
      .rect(0, 0, first.width, this.itemHeight * this.config.visibleRows)
      .fill({ color: 0xffffff });

    this.addChild(mask);
    this.mask = mask;

    this.totalHeight = this.itemViews.length * this.itemHeight;
    this.layoutItems();
  }

  layoutItems() {
    for (let i = 0; i < this.itemViews.length; i++) {
      const itemView = this.itemViews[i];

      itemView.y =
        this.startY +
        ((i * this.itemHeight + this.contentOffset) % this.totalHeight) -
        this.itemHeight;
    }
  }

  update(delta) {
    if (!this.isSpinning || !this.itemViews.length || !this.totalHeight) {
      return;
    }

    if (this.isStopping) {
      this.stopElapsed += delta;

      const t = Math.min(1, this.stopElapsed / this.stopDuration);
      const eased = easeOutBack(t, this.config.overshoot);

      this.contentOffset =
        this.stopStartOffset +
        (this.stopTargetOffset - this.stopStartOffset) * eased;

      if (t >= 1) {
        this.contentOffset = this.stopTargetOffset;
        this.isSpinning = false;
        this.isStopping = false;
      }
    } else {
      this.contentOffset += (this.config.spinSpeed * delta) / 1000;
    }

    this.layoutItems();
  }

  getNearestStopOffset() {
    const step = this.itemHeight;
    const current = this.contentOffset;

    return Math.ceil(current / step) * step;
  }

  get width() {
    return this.itemViews[0]?.width || 0;
  }

  get height() {
    return this.itemHeight * this.config.visibleRows;
  }

  start() {
    this.isSpinning = true;
    this.isStopping = false;
  }

  stop() {
    this.isStopping = true;

    this.stopStartOffset = this.contentOffset;
    this.stopTargetOffset = this.getNearestStopOffset();

    this.stopElapsed = 0;
  }
}

function easeOutBack(t, overshoot = 1.7) {
  const c1 = overshoot;
  const c3 = c1 + 1;
  const x = t - 1;
  return 1 + c3 * x * x * x + c1 * x * x;
}
