import { CItem } from "../models/CItem.js";
import { CSequence } from "../models/CSequence.js";

const SYMBOL_POOL = [
  new CItem({ id: "0", texture: "/symbols/M00_000.jpg" }),
  new CItem({ id: "1", texture: "/symbols/M01_000.jpg" }),
  new CItem({ id: "2", texture: "/symbols/M02_000.jpg" }),
  new CItem({ id: "3", texture: "/symbols/M03_000.jpg" }),
  new CItem({ id: "4", texture: "/symbols/M04_000.jpg" }),
  new CItem({ id: "5", texture: "/symbols/M05_000.jpg" }),
  new CItem({ id: "6", texture: "/symbols/M06_000.jpg" }),
  new CItem({ id: "7", texture: "/symbols/M07_000.jpg" }),
  new CItem({ id: "8", texture: "/symbols/M08_000.jpg" }),
  new CItem({ id: "9", texture: "/symbols/M09_000.jpg" }),
  new CItem({ id: "10", texture: "/symbols/M10_000.jpg" }),
  new CItem({ id: "11", texture: "/symbols/M11_000.jpg" }),
  new CItem({ id: "12", texture: "/symbols/M12_000.jpg" }),
];

export class CGameConfig {
  constructor() {
    this.symbolPool = SYMBOL_POOL;
    this.reelsCount = 5;
    this.visibleRows = 3;
    this.reelSpacing = 7;
    this.reelStopDelay = 300;
    this.stopDuration = 300;
    this.spinSpeed = 1200;
    this.minSpinDuration = 700;
    this.overshoot = 4;
    this.autoStopDelay = 2000;

    this.sequences = [];

    for (let i = 0; i < this.reelsCount; i++) {
      this.sequences.push(buildSequence(i));
    }
  }

  sequenceForReel(index) {
    return this.sequences[index];
  }
}

function buildSequence(seed) {
  const len = SYMBOL_POOL.length;
  const items = [];
  const totalSymbols = 16;

  for (let i = 0; i < totalSymbols; i++) {
    const idx = (i * 3 + seed * 5 + 1) % len;
    items.push(SYMBOL_POOL[idx]);
  }

  return new CSequence(items);
}
