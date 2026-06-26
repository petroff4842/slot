import { Application, Assets, Sprite } from "pixi.js";
import { CGameView } from "./views/CGameView.js";
import { CGameConfig } from "./config/CGameConfig.js";

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

  const bgTexture = await Assets.load("/bg/bg.webp");
  const bg = new Sprite(bgTexture);

  bg.anchor.set(0.5);
  app.stage.addChild(bg);
  resizeBackground();

  const config = new CGameConfig();
  const game = new CGameView(config);

  await game.init();
  game.x = app.screen.width / 2;
  game.y = app.screen.height / 2;

  app.stage.addChild(game);

  app.ticker.add((ticker) => {
    game.update(ticker.deltaMS);
  });

  window.addEventListener("resize", () => {
    resizeBackground();
    game.x = app.screen.width / 2;
    game.y = app.screen.height / 2;
  });

  function resizeBackground() {
    const scale = Math.max(
      app.screen.width / bg.texture.width,
      app.screen.height / bg.texture.height,
    );

    bg.scale.set(scale);
    bg.x = app.screen.width / 2;
    bg.y = app.screen.height / 2;
  }
}

bootstrap();
