import { Application } from "pixi.js";
import { CGameView } from "./views/CGameView.js";
import { CGameConfig } from "./config/CGameConfig.js";
import { CBubblesBackgroundView } from "./views/CBubblesBackgroundView.js";
import { CBackgroundView } from "./views/CBackgroundView.js";
import { CPlayerState } from "./models/CPlayerState.js";
import { CSpinService } from "./services/CSpinService.js";
import { CWinService } from "./services/CWinService.js";

async function bootstrap() {
  const app = new Application();

  await app.init({
    background: "#26a8aa",
    resizeTo: window,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
  });

  const container = document.getElementById("app");

  if (!container) {
    throw new Error("#app not found");
  }

  container.appendChild(app.canvas);

  const background = new CBackgroundView(app.screen.width, app.screen.height);

  await background.init();
  app.stage.addChild(background);

  const bubbles = new CBubblesBackgroundView(
    app.screen.width,
    app.screen.height,
  );

  await bubbles.init();
  app.stage.addChild(bubbles);

  const config = new CGameConfig();
  const playerState = new CPlayerState({
    balance: config.player.initialBalance ?? 1000,
    bet: config.player.initialBet ?? 10,
    minBet: config.player.minBet ?? 10,
    maxBet: config.player.maxBet ?? 100,
    betStep: config.player.betStep ?? 10,
  });
  const spinService = new CSpinService(config);
  const winService = new CWinService(config);
  const game = new CGameView(config, playerState, spinService, winService);

  await game.init();
  game.x = app.screen.width / 2;
  game.y = app.screen.height / 2;
  game.resize(app.screen.width, app.screen.height);

  app.stage.addChild(game);

  app.ticker.add((ticker) => {
    bubbles.update(ticker.deltaMS);
    game.update(ticker.deltaMS);
    background.update(ticker.deltaMS);
  });

  window.addEventListener("resize", () => {
    background.resize(app.screen.width, app.screen.height);
    game.x = app.screen.width / 2;
    game.y = app.screen.height / 2;
    game.resize(app.screen.width, app.screen.height);
    bubbles.resize(app.screen.width, app.screen.height);
  });
}

bootstrap();
