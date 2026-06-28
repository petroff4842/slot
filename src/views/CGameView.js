import { Assets, Container, Graphics } from "pixi.js";
import { CReelView } from "./CReelView.js";
import { CButton } from "../ui/CButton.js";
import { CMachineFrame } from "../ui/CMachineFrame.js";
import { CSpinService } from "../services/CSpinService.js";
import { CWinService } from "../services/CWinService.js";

export class CGameView extends Container {
  constructor(config) {
    super();
    this.config = config;
    this.reels = [];
    this.button = null;
    this.isBusy = false;
    this.isStopping = false;
    this.onAllStopped = null;
    this.autoStopTimer = null;
    this.winLineGraphics = null;
    this.currentWins = [];
    this.spinService = new CSpinService(this.config);
    this.winService = new CWinService(this.config);
  }

  async init() {
    await Assets.load([
      ...this.config.symbolPool.map((item) => item.texture),
      "/ui/button.png",
    ]);

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

    this.winLineGraphics = new Graphics();
    this.addChild(this.winLineGraphics);

    this.initButton();
  }

  initButton() {
    this.button = new CButton("SPIN");

    this.button.x = 0;
    this.button.y = this.reels[0].height / 2 + 80;

    this.button.on("pointerup", () => {
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
        this.showWins(this.currentWins);
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

    this.currentWins = [];

    if (this.winLineGraphics) {
      this.winLineGraphics.clear();
    }

    this.spinStartedAt = performance.now();

    for (const reel of this.reels) {
      reel.start();
    }

    if (this.autoStopTimer) {
      clearTimeout(this.autoStopTimer);
    }

    this.autoStopTimer = setTimeout(() => {
      this.stop();
    }, this.config.autoStopDelay);
  }

  stop() {
    if (!this.isBusy || this.isStopping) {
      return;
    }

    if (this.autoStopTimer) {
      clearTimeout(this.autoStopTimer);
      this.autoStopTimer = null;
    }

    const elapsed = performance.now() - this.spinStartedAt;

    if (elapsed < this.config.minSpinDuration) {
      return;
    }

    this.isStopping = true;

    const spinResult = this.spinService.generate();
    this.currentWins = this.winService.evaluate(spinResult);
    console.log(this.currentWins);

    for (let i = 0; i < this.reels.length; i++) {
      setTimeout(() => {
        this.reels[i].stopWith(spinResult.reelAt(i));
      }, i * this.config.reelStopDelay);
    }
  }

  getSymbolLinePoint(reelIndex, rowIndex, side = "left") {
    const reel = this.reels[reelIndex];
    let x = reel.x;
    if (side === "right") {
      x += reel.width;
    }

    return {
      x: x,
      y: reel.y + reel.itemHeight * rowIndex + reel.itemHeight / 2,
    };
  }

  getWinLinePoints(win) {
    const points = [];

    const line = win.line;
    const count = win.count;

    for (let i = 0; i < count; i++) {
      const leftPoint = this.getSymbolLinePoint(i, line[i], "left");
      const rightPoint = this.getSymbolLinePoint(i, line[i], "right");
      points.push(leftPoint, rightPoint);
    }
    return points;
  }

  showWins(wins) {
    if (!this.winLineGraphics) {
      return;
    }
    this.winLineGraphics.clear();
    for (const win of wins) {
      const points = this.getWinLinePoints(win);
      if (points.length < 2) {
        continue;
      }
      this.winLineGraphics.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        this.winLineGraphics.lineTo(points[i].x, points[i].y);
      }
      this.winLineGraphics.stroke({
        width: 4,
        color: 0xffff00,
        alpha: 0.95,
      });
    }
  }

  get isSpinning() {
    return this.reels.some((reel) => reel.isSpinning);
  }
}
