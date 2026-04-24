import { Container, Graphics } from "pixi.js";
import { CItemView } from "./CItemView.js";
import { CReelView } from "./CReelView.js";
import { CButton } from "../ui/CButton.js";
import { CMachineFrame } from "../ui/CMachineFrame.js";

export class CGameView extends Container {
  constructor(config) {
    super();
    this.config = config;
    this.reels = [];
    this.button = null;
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
    const totalHeight = this.reels[0].height;

    for (const reel of this.reels) {
      reel.x = offsetX;
      offsetX += reel.width + this.config.reelSpacing;
      reel.y = -totalHeight / 2;
    }

    const frame = new CMachineFrame(totalWidth, totalHeight, 20);
    frame.y = -totalHeight / 2;
    this.addChildAt(frame, 0);

    this.button = new CButton("SPIN");

    this.button.x = -this.button.width / 2;
    this.button.y = this.reels[0].height / 2 + 80;

    this.button.on("pointerdown", () => {
      if (!this.isBusy) {
        this.spin();
        this.button.setText("STOP");
        this.button.setEnabled(false);

        setTimeout(() => {
          this.button.setEnabled(true);
        }, this.config.minSpinDuration);
      } else {
        this.button.setEnabled(false);
        this.stop();
      }
    });

    this.addChild(this.button);
    this.onAllStopped = () => {
      this.button.setText("SPIN");
      this.button.setEnabled(true);
    };
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
