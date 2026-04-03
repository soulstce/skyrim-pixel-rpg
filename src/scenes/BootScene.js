export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  createPixelTexture(key, drawFn, size = 32) {
    if (this.textures.exists(key)) {
      return;
    }

    const g = this.add.graphics();
    drawFn(g, size);
    g.generateTexture(key, size, size);
    g.destroy();
  }

  create() {
    this.createPixelTexture('player-kael', (g, size) => {
      g.clear();
      g.fillStyle(0x2b1626, 1).fillRect(0, 0, size, size);
      g.fillStyle(0x7a4f2a, 1).fillRect(6, 4, 20, 20);
      g.fillStyle(0xffd9b0, 1).fillRect(10, 6, 12, 8);
      g.fillStyle(0x3f87ff, 1).fillRect(8, 16, 16, 10);
      g.fillStyle(0xff8b4a, 1).fillRect(20, 14, 6, 6);
    });

    this.createPixelTexture('elder-rowan', (g, size) => {
      g.fillStyle(0x1b1f2a, 1).fillRect(0, 0, size, size);
      g.fillStyle(0x93a4a8, 1).fillCircle(16, 12, 10);
      g.fillStyle(0x5c402f, 1).fillRect(8, 16, 16, 10);
      g.fillStyle(0xf7e3c0, 1).fillRect(12, 8, 8, 6);
      g.fillStyle(0xd6d6d6, 1).fillRect(10, 0, 12, 6);
    });

    this.createPixelTexture('ash-wolf', (g, size) => {
      g.fillStyle(0x11151f, 1).fillRect(0, 0, size, size);
      g.fillStyle(0x7c5d4b, 1).fillRect(4, 10, 24, 12);
      g.fillStyle(0xb36f4d, 1).fillRect(8, 6, 6, 6);
      g.fillStyle(0xb36f4d, 1).fillRect(18, 6, 6, 6);
      g.fillStyle(0xd9c09b, 1).fillRect(22, 14, 4, 4);
      g.fillStyle(0xd9c09b, 1).fillRect(6, 14, 4, 4);
    });

    this.createPixelTexture('chest', (g, size) => {
      g.fillStyle(0x24160f, 1).fillRect(0, 0, size, size);
      g.fillStyle(0x8d5a2b, 1).fillRect(4, 10, 24, 14);
      g.fillStyle(0xd8a84d, 1).fillRect(4, 8, 24, 6);
      g.fillStyle(0x4e300f, 1).fillRect(14, 13, 4, 8);
    });

    this.createPixelTexture('shrine', (g, size) => {
      g.fillStyle(0x0c1720, 1).fillRect(0, 0, size, size);
      g.fillStyle(0x7d7471, 1).fillRect(5, 6, 22, 20);
      g.fillStyle(0xbba89b, 1).fillRect(10, 12, 12, 6);
      g.fillStyle(0xff7a45, 1).fillCircle(16, 8, 4);
    });

    this.scene.start('TitleScene');
  }
}
