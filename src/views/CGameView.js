import { Assets, Container } from "pixi.js";
import { CReelView } from "./CReelView.js";
import { CSpinButton } from "../ui/CSpinButton.js";
import { CMachineFrame } from "../ui/CMachineFrame.js";
import { CWinLinesView } from "./CWinLinesView.js";
import { CGameHudView } from "./CGameHudView.js";

export class CGameView extends Container {
  constructor(config, playerState, spinService, winService) {
    super();
    this.config = config;
    this.playerState = playerState;
    this.spinService = spinService;
    this.winService = winService;
    this.reels = [];
    this.button = null;
    this.isBusy = false;
    this.isStopping = false;
    this.onAllStopped = null;
    this.autoStopTimer = null;
    this.winLinesView = null;
    this.currentWinResult = { wins: [], totalWin: 0 };
    this.currentWinSum = 0;
    this.hudView = null;
  }

  async init() {
    await Assets.load([
      ...this.config.symbolPool.map((item) => item.texture),
      "/ui/button.png",
      "/ui/spin.png",
      "/ui/stop.png",
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

    this.winLinesView = new CWinLinesView();
    this.addChild(this.winLinesView);

    this.hudView = new CGameHudView(this.config.hud);
    this.hudView.setBalance(this.playerState.balance);
    this.hudView.setBet(this.playerState.bet);
    this.addChild(this.hudView);

    this.initButton();
  }

  initButton() {
    this.button = new CSpinButton({
      texturePath: "/ui/button.png",
      scale: 0.8,
      glowScale: 0.815,
      glowTint: 0xffdd00,
      onPress: () => this.handleSpinButtonPress(),
    });
    this.button.setState(true);

    this.button.x = 0;
    this.button.y = this.reels[0].height / 2 + 80;

    this.addChild(this.button);
    this.onAllStopped = () => {
      this.button.setState(true);
      this.button.setEnabled(true);
      if (this.hudView) {
        const winAmount = this.currentWinSum;
        this.hudView.countWin(winAmount, () => {
          if (winAmount > 0) {
            const oldBalance = this.playerState.balance;
            const newBalance = this.playerState.addWin(winAmount);
            this.hudView.countBalance(oldBalance, newBalance);
          }
        });
      }
    };
  }

  handleSpinButtonPress() {
    if (!this.isBusy) {
      const started = this.spin();

      if (!started) {
        return;
      }

      this.button.setEnabled(false);

      setTimeout(() => {
        this.button.setEnabled(true);
        this.button.setState(false);
      }, this.config.minSpinDuration);
    } else {
      const stopped = this.stop();

      if (stopped) {
        this.button.setEnabled(false);
      }
    }
  }

  update(delta) {
    for (const reel of this.reels) {
      reel.update(delta);
    }
    if (this.winLinesView) {
      this.winLinesView.update(delta);
    }
    if (this.isBusy && this.isStopping) {
      const allStopped = this.reels.every((reel) => !reel.isSpinning);

      if (allStopped) {
        if (this.winLinesView) {
          this.winLinesView.show(this.currentWinResult.wins, this.reels);
        }
        this.isBusy = false;
        this.isStopping = false;
        if (this.onAllStopped) {
          this.onAllStopped();
        }
      }
    }
    if (this.hudView) {
      this.hudView.update(delta);
    }
  }

  spin() {
    if (this.isBusy) {
      return false;
    }

    const oldBalance = this.playerState.balance;

    if (!this.playerState.placeBet()) {
      return false;
    }

    const newBalance = this.playerState.balance;

    if (this.hudView) {
      this.hudView.countBalance(oldBalance, newBalance);
    }

    this.currentWinSum = 0;
    this.isBusy = true;
    this.isStopping = false;

    this.currentWinResult = { wins: [], totalWin: 0 };

    if (this.winLinesView) {
      this.winLinesView.clear();
    }

    if (this.hudView) {
      this.hudView.clearWin();
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
    return true;
  }

  stop() {
    if (!this.isBusy || this.isStopping) {
      return false;
    }

    const elapsed = performance.now() - this.spinStartedAt;

    if (elapsed < this.config.minSpinDuration) {
      return false;
    }

    if (this.autoStopTimer) {
      clearTimeout(this.autoStopTimer);
      this.autoStopTimer = null;
    }

    this.isStopping = true;

    const spinResult = this.spinService.generate();
    this.currentWinResult = this.winService.evaluate(spinResult);
    console.log(this.currentWinResult.wins);

    this.currentWinSum = this.currentWinResult.totalWin;
    console.log(this.currentWinSum);

    for (let i = 0; i < this.reels.length; i++) {
      setTimeout(() => {
        this.reels[i].stopWith(spinResult.reelAt(i));
      }, i * this.config.reelStopDelay);
    }
    return true;
  }

  resize(width, height) {
    if (this.hudView) {
      this.hudView.resize(width, height);
    }
  }

  get isSpinning() {
    return this.reels.some((reel) => reel.isSpinning);
  }
}
