import { Container, Graphics } from "pixi.js";
import { CItemView } from "./CItemView.js";
import { easeOutBack } from "../utils/easing.js";

export class CReelView extends Container {
  constructor(sequence, config) {
    super();
    this.sequence = sequence;
    this.config = config;
    this.itemViews = [];
    this.contentOffset = 0;
    this.itemHeight = null;
    this.totalHeight = 0;
    this.isSpinning = false;
    this.isStopping = false;
    this.stopTargetOffset = 0;

    this.stopStartOffset = 0;
    this.stopBrakeStartOffset = 0;
    this.stopElapsed = 0;
    this.stopDuration = this.config.stopDuration;
    this.spinStartElapsed = 0;
    this.isStopBraking = false;
    this.forcedItems = new Map();
    this.sortableChildren = true;
  }

  async init() {
    for (let i = 0; i < this.config.reelItemsCount; i++) {
      const item = this.sequence.at(i);

      const itemView = new CItemView(this.config.symbolScale);
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

  layoutItems() {
    const staleForcedItems = [];

    for (let i = 0; i < this.itemViews.length; i++) {
      const itemView = this.itemViews[i];

      const rawPosition = i * this.itemHeight + this.contentOffset;

      const cycle = Math.floor(rawPosition / this.totalHeight);

      const itemIndex = i - cycle * this.itemViews.length;
      const forcedItem = this.forcedItems.get(i);

      itemView.setItem(forcedItem || this.sequence.at(itemIndex));

      itemView.y = (rawPosition % this.totalHeight) - this.itemHeight;

      if (
        forcedItem &&
        this.isSpinning &&
        !this.isStopping &&
        !this.isVisibleY(itemView.y)
      ) {
        staleForcedItems.push(i);
      }
    }

    for (const index of staleForcedItems) {
      this.forcedItems.delete(index);
    }
  }

  isVisibleY(y) {
    return y >= 0 && y < this.itemHeight * this.config.visibleRows;
  }

  update(delta) {
    if (!this.isSpinning || !this.itemViews.length || !this.totalHeight) {
      return;
    }

    if (this.isStopping) {
      this.updateStopping(delta);
    } else {
      this.spinStartElapsed += delta;

      const startDuration = this.config.spinStartDuration || 0;
      const startProgress =
        startDuration > 0
          ? Math.min(1, this.spinStartElapsed / startDuration)
          : 1;
      const speedMultiplier = startProgress * startProgress;

      this.contentOffset +=
        (this.config.spinSpeed * speedMultiplier * delta) / 1000;
    }

    this.layoutItems();
  }

  updateStopping(delta) {
    if (!this.isStopBraking) {
      if (this.contentOffset < this.stopBrakeStartOffset) {
        const step = (this.config.spinSpeed * delta) / 1000;
        this.contentOffset = Math.min(
          this.contentOffset + step,
          this.stopBrakeStartOffset,
        );
        return;
      }

      this.isStopBraking = true;
      this.stopStartOffset = this.contentOffset;
      this.stopElapsed = 0;
    }

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
      this.isStopBraking = false;
    }
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
    this.isStopBraking = false;
    this.spinStartElapsed = 0;
  }

  stop() {
    this.stopWith(null);
  }

  stopWith(resultItems) {
    if (!this.isSpinning || this.isStopping) {
      return;
    }

    this.isStopping = true;

    this.stopStartOffset = this.contentOffset;
    this.stopTargetOffset = this.getStopTargetOffset();
    this.stopBrakeStartOffset = this.stopTargetOffset - this.itemHeight;
    this.stopDuration = this.config.stopDuration;
    this.isStopBraking = false;

    if (resultItems) {
      this.assignResultItems(resultItems, this.stopTargetOffset);
    }

    this.stopElapsed = 0;
  }

  getStopTargetOffset() {
    const step = this.itemHeight;
    const minStopDistance = step * (this.config.visibleRows + 2);

    let targetOffset = this.getNearestStopOffset();

    while (targetOffset - this.contentOffset < minStopDistance) {
      targetOffset += step;
    }

    return targetOffset;
  }

  assignResultItems(resultItems, targetOffset) {
    this.forcedItems.clear();

    for (let i = 0; i < this.itemViews.length; i++) {
      const finalRawPosition = i * this.itemHeight + targetOffset;
      const finalY = (finalRawPosition % this.totalHeight) - this.itemHeight;
      const finalRow = Math.round(finalY / this.itemHeight);

      if (finalRow >= 0 && finalRow < this.config.visibleRows) {
        this.forcedItems.set(i, resultItems[finalRow]);
      }
    }
  }

  getVisibleItemView(rowIndex) {
    return this.itemViews.find((itemView) => {
      const itemRow = Math.round(itemView.y / this.itemHeight);

      return itemRow === rowIndex;
    });
  }
}
