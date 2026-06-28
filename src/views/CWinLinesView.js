import { Container, Graphics } from "pixi.js";

export class CWinLinesView extends Container {
  constructor() {
    super();

    this.graphics = new Graphics();
    this.addChild(this.graphics);

    this.currentWins = [];
    this.currentReels = [];
    this.currentWinIndex = 0;
    this.winLineElapsed = 0;
    this.winLineDuration = 1200;
    this.animatedItems = new Set();
    this.isAnimatingWins = false;
  }

  clear() {
    this.graphics.clear();

    this.stopSymbolAnimations();

    this.currentWins = [];
    this.currentReels = [];
    this.currentWinIndex = 0;
    this.winLineElapsed = 0;
    this.isAnimatingWins = false;
  }

  getSymbolLinePoint(reels, reelIndex, rowIndex, side = "left") {
    const reel = reels[reelIndex];

    let x = reel.x;

    if (side === "right") {
      x += reel.width;
    }

    return {
      x,
      y: reel.y + reel.itemHeight * rowIndex + reel.itemHeight / 2,
    };
  }

  getWinLinePoints(win, reels) {
    const points = [];

    const line = win.line;
    const count = win.count;

    for (let i = 0; i < count; i++) {
      const leftPoint = this.getSymbolLinePoint(reels, i, line[i], "left");
      const rightPoint = this.getSymbolLinePoint(reels, i, line[i], "right");

      points.push(leftPoint, rightPoint);
    }

    return points;
  }

  update(delta) {
    if (!this.isAnimatingWins) {
      return;
    }

    for (const itemView of this.animatedItems) {
      itemView.updateWinAnimation(delta);
    }

    if (this.currentWins.length <= 1) {
      return;
    }

    this.winLineElapsed += delta;

    if (this.winLineElapsed < this.winLineDuration) {
      return;
    }

    this.winLineElapsed = 0;
    this.currentWinIndex = (this.currentWinIndex + 1) % this.currentWins.length;

    this.showCurrentWinSymbols();
  }

  show(wins, reels) {
    this.clear();

    this.currentWins = wins;
    this.currentReels = reels;
    this.currentWinIndex = 0;
    this.winLineElapsed = 0;
    this.isAnimatingWins = wins.length > 0;

    if (this.isAnimatingWins) {
      this.showCurrentWinSymbols();
    }
  }

  stopSymbolAnimations() {
    for (const itemView of this.animatedItems) {
      itemView.stopWinAnimation();
    }

    this.animatedItems.clear();
  }

  showCurrentWinSymbols() {
    this.stopSymbolAnimations();
    this.drawCurrentWinLine();

    const win = this.currentWins[this.currentWinIndex];

    if (!win) {
      return;
    }

    for (let reelIndex = 0; reelIndex < win.count; reelIndex++) {
      const reel = this.currentReels[reelIndex];
      const rowIndex = win.line[reelIndex];

      const itemView = reel.getVisibleItemView(rowIndex);

      if (!itemView) {
        continue;
      }

      itemView.startWinAnimation();
      this.animatedItems.add(itemView);
    }
  }

  drawCurrentWinLine() {
    this.graphics.clear();

    const win = this.currentWins[this.currentWinIndex];

    if (!win) {
      return;
    }

    const points = this.getWinLinePoints(win, this.currentReels);

    if (points.length < 2) {
      return;
    }

    this.graphics.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      this.graphics.lineTo(points[i].x, points[i].y);
    }

    this.graphics.stroke({
      width: 4,
      color: 0xffff00,
      alpha: 0.95,
    });
  }
}
