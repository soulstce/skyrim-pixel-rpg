import BootScene from './src/scenes/BootScene.js';
import OverworldScene from './src/scenes/OverworldScene.js';
import BattleScene from './src/scenes/BattleScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 960,
  height: 540,
  backgroundColor: '#0b1020',
  pixelArt: true,
  roundPixels: true,
  input: {
    activePointers: 10
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  callbacks: {
    postBoot: (game) => {
      if (game.input?.addPointer) {
        game.input.addPointer(3);
      }
      if (game.canvas) {
        game.canvas.style.touchAction = 'none';
        game.canvas.style.webkitTouchCallout = 'none';
        game.canvas.style.webkitUserDrag = 'none';
      }
    }
  },
  scene: [BootScene, OverworldScene, BattleScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 960,
    height: 540
  }
};

const game = new Phaser.Game(config);
window.__pokeGame = game;
window.__pokeStartQueued = Boolean(window.__pokeStartQueued);
window.__pokeStartGame = () => {
  const overlay = document.getElementById('start-overlay');
  if (overlay) {
    overlay.remove();
  }

  if (window.__pokeGame?.registry) {
    window.__pokeGame.registry.set('gameStarted', true);
  } else {
    window.__pokeStartQueued = true;
  }
};

if (window.__pokeStartQueued) {
  window.__pokeGame?.registry?.set('gameStarted', true);
}
