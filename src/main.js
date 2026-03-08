import Phaser from "phaser";
import PreloadScene from "./PreloadScene.js";
import HomeScene from "./HomeScene.js";
import Game from "./Game.js";
import RestartScene from "./RestartScene.js";
import ReplayScene from "./ReplayScene.js";
import InfoScene from "./InfoScene.js";
import LeaderboardScene from "./LeaderboardScene.js";

// Game configuration
const config = {
  parent: "game",
  type: Phaser.AUTO,
  width: 800,
  height: 1400,
  border: 2,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  dom: {
    createContainer: true,
  },
  input: {
    activePointers: 3,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [
    PreloadScene,
    HomeScene,
    Game,
    RestartScene,
    ReplayScene,
    InfoScene,
    LeaderboardScene,
  ],
};

// Initialize the game
const game = new Phaser.Game(config);

// Prevent context menu on right click
window.oncontextmenu = (event) => {
  event.preventDefault();
};

// Override console.warn to prevent warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && args[0].includes) {
    return;
  }
  originalWarn.apply(console, args);
};

// Export game instance for global access
export default game;
