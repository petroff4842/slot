import { Container, Graphics } from "pixi.js";
import { CItemView } from "./CItemView.js";
import { easeOutBack } from "../utils/easing.js";

export class CReelView extends Container {
  constructor(config) {
    super();
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
    for (let i = 0; i < this.config.reelItemsCount; i++) {
      const item = this.getRandomItem();

      const itemView = new CItemView(this.config.symbolScale);
      itemView.lastCycle = 0;
      itemView.setItem(item);

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

  getRandomItem() {
    const index = Math.floor(Math.random() * this.config.symbolPool.length);
    return this.config.symbolPool[index];
  }

  layoutItems() {
    for (let i = 0; i < this.itemViews.length; i++) {
      const itemView = this.itemViews[i];

      const rawPosition = i * this.itemHeight + this.contentOffset;

      const cycle = Math.floor(rawPosition / this.totalHeight);

      if (cycle !== itemView.lastCycle) {
        itemView.setItem(this.getRandomItem());
        itemView.lastCycle = cycle;
      }

      itemView.y =
        this.startY + (rawPosition % this.totalHeight) - this.itemHeight;
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
