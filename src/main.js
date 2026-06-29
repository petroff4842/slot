import { Application } from "pixi.js";
import { CGameView } from "./views/CGameView.js";
import { CGameConfig } from "./config/CGameConfig.js";
import { CBubblesBackgroundView } from "./views/CBubblesBackgroundView.js";
import { CBackgroundView } from "./views/CBackgroundView.js";

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
  const game = new CGameView(config);

  await game.init();
  game.x = app.screen.width / 2;
  game.y = app.screen.height / 2;

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
    bubbles.resize(app.screen.width, app.screen.height);
  });
}

bootstrap();
