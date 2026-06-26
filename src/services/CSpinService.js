import { CSpinResult } from "../models/CSpinResult.js";

export class CSpinService {
  constructor(config) {
    this.config = config;
  }

  generate() {
    const reels = [];

    for (let reelIndex = 0; reelIndex < this.config.reelsCount; reelIndex++) {
      const items = [];

      for (let row = 0; row < this.config.visibleRows; row++) {
        items.push(this.getRandomItem());
      }

      reels.push(items);
    }

    return new CSpinResult(reels);
  }

  getRandomItem() {
    const pool = this.config.symbolPool;
    const index = Math.floor(Math.random() * pool.length);

    return pool[index];
  }
}
