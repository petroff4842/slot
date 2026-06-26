export class CSpinResult {
  constructor(reels) {
    this.reels = reels;
  }

  reelAt(index) {
    return this.reels[index];
  }
}
