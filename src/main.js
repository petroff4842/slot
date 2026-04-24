import { Application } from "pixi.js";
import { CGameView } from "./views/CGameView.js";
import { CGameConfig } from "./config/CGameConfig";
import { CButton } from "./ui/CButton.js";

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

  const config = new CGameConfig();
  const game = new CGameView(config);

  await game.init();
  game.x = app.screen.width / 2;
  game.y = app.screen.height / 2;

  app.stage.addChild(game);

  app.ticker.add((ticker) => {
    game.update(ticker.deltaMS);
  });

  const button = new CButton("SPIN");

  button.x = app.screen.width / 2 - button.width / 2;
  button.y = app.screen.height - 80;

  button.on("pointerdown", () => {
    if (!game.isBusy) {
      game.spin();
      button.setText("STOP");
      button.setEnabled(false);

      setTimeout(() => {
        button.setEnabled(true);
      }, game.config.minSpinDuration);
    } else {
      button.setEnabled(false);
      game.stop();
    }
  });

  app.stage.addChild(button);
  game.onAllStopped = () => {
    button.setText("SPIN");
    button.setEnabled(true);
  };

  window.addEventListener("resize", () => {
    game.x = app.screen.width / 2;
    game.y = app.screen.height / 2;
    button.x = app.screen.width / 2;
  });
}

bootstrap();
