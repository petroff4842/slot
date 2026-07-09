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
    this.spinStartDuration = 300;
    this.spinSpeed = 1200;
    this.minSpinDuration = 700;
    this.overshoot = 1.5;
    this.autoStopDelay = 2000;
    this.reelItemsCount = 8;
    this.symbolScale = 1.5;

    this.sequences = [];

    this.paylines = [
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2],
      [0, 1, 2, 1, 0],
      [2, 1, 0, 1, 2],
      [0, 0, 1, 2, 2],
      [2, 2, 1, 0, 0],
      [1, 0, 0, 0, 1],
      [1, 2, 2, 2, 1],
      [2, 1, 2, 1, 2],
    ];

    this.paytable = {
      0: {
        3: 100,
        4: 1000,
        5: 2000,
      },

      1: {
        3: 50,
        4: 500,
        5: 1000,
      },

      2: {
        3: 20,
        4: 150,
        5: 750,
      },

      3: {
        3: 15,
        4: 100,
        5: 500,
      },

      4: {
        3: 15,
        4: 100,
        5: 500,
      },

      5: {
        3: 10,
        4: 75,
        5: 250,
      },

      6: {
        3: 5,
        4: 50,
        5: 150,
      },

      7: {
        3: 5,
        4: 25,
        5: 150,
      },

      8: {
        3: 5,
        4: 25,
        5: 150,
      },

      9: {
        3: 5,
        4: 15,
        5: 100,
      },

      10: {
        3: 5,
        4: 15,
        5: 100,
      },

      11: {
        3: 5,
        4: 15,
        5: 100,
      },

      12: {
        3: 5,
        4: 15,
        5: 100,
      },
    };

    for (let i = 0; i < this.reelsCount; i++) {
      this.sequences.push(buildSequence(i));
    }

    this.player = {
      initialBalance: 1000,
    };
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
