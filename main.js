import BootScene from './src/scenes/BootScene.js';
import TitleScene from './src/scenes/TitleScene.js';
import OverworldScene from './src/scenes/OverworldScene.js';
import BattleScene from './src/scenes/BattleScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 960,
  height: 540,
  backgroundColor: '#101827',
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [BootScene, TitleScene, OverworldScene, BattleScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 960,
    height: 540
  }
};

new Phaser.Game(config);
