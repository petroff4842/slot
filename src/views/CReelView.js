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
    this.startY = 0;
    this.itemHeight = null;
    this.totalHeight = 0;
    this.isSpinning = false;
    this.isStopping = false;
    this.stopTargetOffset = 0;

    this.stopStartOffset = 0;
    this.stopEaseStartOffset = 0;
    this.stopElapsed = 0;
    this.stopDuration = this.config.stopDuration;
    this.spinStartElapsed = 0;
    this.isStopEasing = false;
    this.sequenceShift = 0;
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
    for (let i = 0; i < this.itemViews.length; i++) {
      const itemView = this.itemViews[i];

      const rawPosition = i * this.itemHeight + this.contentOffset;

      const cycle = Math.floor(rawPosition / this.totalHeight);

      const itemIndex = i - cycle * this.itemViews.length + this.sequenceShift;

      itemView.setItem(this.sequence.at(itemIndex));

      itemView.y =
        this.startY + (rawPosition % this.totalHeight) - this.itemHeight;
    }
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
    if (!this.isStopEasing) {
      if (this.contentOffset < this.stopEaseStartOffset) {
        const step = (this.config.spinSpeed * delta) / 1000;
        this.contentOffset = Math.min(
          this.contentOffset + step,
          this.stopEaseStartOffset,
        );
        return;
      }

      this.isStopEasing = true;
      this.stopStartOffset = this.contentOffset;
      this.stopElapsed = 0;
      this.stopDuration = this.config.stopDuration;
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
      this.isStopEasing = false;
    }
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
    this.isStopEasing = false;
    this.spinStartElapsed = 0;
  }

  stopAt(index) {
    const targetOffset = this.getOffsetForIndex(index);
    this.beginStop(targetOffset, index);
  }

  beginStop(targetOffset, index = null) {
    this.isStopping = true;

    this.stopStartOffset = this.contentOffset;
    this.stopTargetOffset = targetOffset;
    this.isStopEasing = false;

    if (index != null) {
      const targetStep = Math.round(this.stopTargetOffset / this.itemHeight);

      this.sequenceShift = this.getSequenceShiftForTargetStep(
        targetStep,
        index,
      );
    }

    const distance = Math.max(0, this.stopTargetOffset - this.stopStartOffset);
    const easeDistance = Math.min(this.itemHeight, distance);

    this.stopEaseStartOffset = this.stopTargetOffset - easeDistance;
    this.stopDuration = this.config.stopDuration;
    this.stopElapsed = 0;
  }

  getOffsetForIndex(index) {
    const step = this.itemHeight;
    const currentStep = this.contentOffset / step;
    const cruiseDuration =
      this.config.stopCruiseDuration || this.config.reelStopDelay || 300;
    const cruiseDistance = (this.config.spinSpeed * cruiseDuration) / 1000;
    const targetStep = Math.ceil(currentStep + cruiseDistance / step + 1);

    return targetStep * step;
  }

  getSequenceShiftForTargetStep(targetStep, index) {
    const sequenceLength = this.sequence.length;

    return (
      (((targetStep - 1 + index) % sequenceLength) + sequenceLength) %
      sequenceLength
    );
  }
}
