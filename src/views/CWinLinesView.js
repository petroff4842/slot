import { Container, Graphics } from "pixi.js";

export class CWinLinesView extends Container {
  constructor() {
    super();

    this.graphics = new Graphics();
    this.addChild(this.graphics);
  }

  clear() {
    this.graphics.clear();
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

  show(wins, reels) {
    this.clear();

    for (const win of wins) {
      const points = this.getWinLinePoints(win, reels);

      if (points.length < 2) {
        continue;
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
}
