import { Container, Graphics } from "pixi.js";
import { CItemView } from "./CItemView.js";
import { CReelView } from "./CReelView.js";

export class CGameView extends Container {
  constructor(config) {
    super();
    this.config = config;
    this.reels = [];
    this.isBusy = false;
    this.isStopping = false;
    this.onAllStopped = null;
  }

  async init() {
    for (let i = 0; i < this.config.reelsCount; i++) {
      const sequence = this.config.sequenceForReel(i);
      const reel = new CReelView(sequence, this.config);
      await reel.init();
      reel.x = i * (reel.width + this.config.reelSpacing);
      reel.y = 0;
      this.reels.push(reel);
      this.addChild(reel);
    }
    const totalWidth =
      this.reels.reduce((sum, reel) => sum + reel.width, 0) +
      (this.reels.length - 1) * this.config.reelSpacing;

    const startX = -totalWidth / 2;

    let offsetX = startX;

    for (const reel of this.reels) {
      reel.x = offsetX;
      offsetX += reel.width + this.config.reelSpacing;
    }
  }

  update(delta) {
    for (const reel of this.reels) {
      reel.update(delta);
    }
    if (this.isBusy && this.isStopping) {
      const allStopped = this.reels.every((reel) => !reel.isSpinning);

      if (allStopped) {
        this.isBusy = false;
        this.isStopping = false;
        if (this.onAllStopped) {
          this.onAllStopped();
        }
      }
    }
  }

  spin() {
    if (this.isBusy) {
      return;
    }

    this.isBusy = true;
    this.isStopping = false;

    this.spinStartedAt = performance.now();

    for (const reel of this.reels) {
      reel.start();
    }
  }

  stop() {
    if (!this.isBusy || this.isStopping) {
      return;
    }

    const elapsed = performance.now() - this.spinStartedAt;

    if (elapsed < this.config.minSpinDuration) {
      return;
    }

    this.isStopping = true;

    for (let i = 0; i < this.reels.length; i++) {
      setTimeout(() => {
        this.reels[i].stop();
      }, i * this.config.reelStopDelay);
    }
  }

  get isSpinning() {
    return this.reels.some((reel) => reel.isSpinning);
  }
}
