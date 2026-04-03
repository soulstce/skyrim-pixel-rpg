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
    this.createPixelTexture('grass-tile', (g, s) => {
      g.fillStyle(0x365f2c, 1).fillRect(0, 0, s, s);
      g.fillStyle(0x2e5125, 1).fillRect(0, 0, s, 4);
      g.fillStyle(0x447437, 1).fillRect(4, 7, 6, 4);
      g.fillStyle(0x4f843f, 1).fillRect(18, 12, 5, 4);
      g.fillStyle(0x2a441f, 1).fillRect(10, 22, 4, 3);
      g.fillStyle(0x5d9c49, 1).fillRect(24, 24, 3, 3);
    });

    this.createPixelTexture('dirt-tile', (g, s) => {
      g.fillStyle(0x6d4b2b, 1).fillRect(0, 0, s, s);
      g.fillStyle(0x7e5632, 1).fillRect(2, 2, 10, 7);
      g.fillStyle(0x5f3f24, 1).fillRect(12, 14, 6, 5);
      g.fillStyle(0x8b6238, 1).fillRect(20, 4, 7, 4);
      g.fillStyle(0x4f351d, 1).fillRect(6, 24, 5, 4);
    });

    this.createPixelTexture('stone-path-tile', (g, s) => {
      g.fillStyle(0x7e8a92, 1).fillRect(0, 0, s, s);
      g.fillStyle(0x67737a, 1).fillRect(1, 3, 9, 8);
      g.fillStyle(0xaeb8bd, 1).fillRect(12, 5, 8, 7);
      g.fillStyle(0x5d6770, 1).fillRect(21, 14, 7, 6);
      g.fillStyle(0xd3d7db, 1).fillRect(6, 22, 4, 3);
    });

    this.createPixelTexture('town-border-tile', (g, s) => {
      g.fillStyle(0x3a332e, 1).fillRect(0, 0, s, s);
      g.fillStyle(0x5a4f46, 1).fillRect(3, 3, 10, 26);
      g.fillStyle(0x77685d, 1).fillRect(14, 6, 7, 20);
      g.fillStyle(0x8b7b6d, 1).fillRect(23, 8, 4, 16);
    });

    this.createPixelTexture('house', (g, s) => {
      g.fillStyle(0x0d1420, 1).fillRect(0, 0, s, s);
      g.fillStyle(0xa66a3f, 1).fillRect(6, 13, 20, 14);
      g.fillStyle(0x7b3a2d, 1).fillRect(4, 5, 24, 12);
      g.fillStyle(0xd5b07b, 1).fillRect(10, 18, 4, 9);
      g.fillStyle(0xcfd8df, 1).fillRect(19, 18, 4, 4);
      g.fillStyle(0x5b2a22, 1).fillRect(13, 20, 6, 7);
    });

    this.createPixelTexture('tree', (g, s) => {
      g.fillStyle(0x10161b, 1).fillRect(0, 0, s, s);
      g.fillStyle(0x5b3d23, 1).fillRect(14, 16, 4, 12);
      g.fillStyle(0x2f5a2a, 1).fillCircle(16, 11, 9);
      g.fillStyle(0x3f7336, 1).fillCircle(11, 14, 6);
      g.fillStyle(0x4f8b40, 1).fillCircle(21, 15, 5);
    });

    this.createPixelTexture('rock', (g, s) => {
      g.fillStyle(0x1a2029, 1).fillRect(0, 0, s, s);
      g.fillStyle(0x8e8a84, 1).fillCircle(16, 17, 10);
      g.fillStyle(0x7a756f, 1).fillCircle(11, 14, 5);
      g.fillStyle(0xb8b4ac, 1).fillCircle(20, 12, 4);
    });

    this.createPixelTexture('fence', (g, s) => {
      g.fillStyle(0x1b1714, 1).fillRect(0, 0, s, s);
      g.fillStyle(0x7a5632, 1).fillRect(5, 6, 4, 20);
      g.fillStyle(0x7a5632, 1).fillRect(14, 6, 4, 20);
      g.fillStyle(0x7a5632, 1).fillRect(23, 6, 4, 20);
      g.fillStyle(0x5c3c20, 1).fillRect(4, 11, 22, 3);
      g.fillStyle(0x5c3c20, 1).fillRect(4, 18, 22, 3);
    });

    this.createPixelTexture('player-kael-down', (g, s) => {
      g.fillStyle(0x24131f, 1).fillRect(0, 0, s, s);
      g.fillStyle(0x6f4428, 1).fillRect(10, 4, 12, 10);
      g.fillStyle(0xf2c7a0, 1).fillRect(12, 6, 8, 5);
      g.fillStyle(0x3f8bff, 1).fillRect(9, 15, 14, 10);
      g.fillStyle(0xff8a4d, 1).fillRect(20, 14, 5, 5);
      g.fillStyle(0x1f1b24, 1).fillRect(10, 25, 4, 4);
      g.fillStyle(0x1f1b24, 1).fillRect(18, 25, 4, 4);
    });

    this.createPixelTexture('player-kael-up', (g, s) => {
      g.fillStyle(0x24131f, 1).fillRect(0, 0, s, s);
      g.fillStyle(0x5d3420, 1).fillRect(9, 4, 14, 10);
      g.fillStyle(0x7d4f31, 1).fillRect(10, 6, 12, 4);
      g.fillStyle(0x2d6fba, 1).fillRect(8, 15, 16, 10);
      g.fillStyle(0x1b1720, 1).fillRect(11, 25, 4, 4);
      g.fillStyle(0x1b1720, 1).fillRect(17, 25, 4, 4);
    });

    this.createPixelTexture('player-kael-side', (g, s) => {
      g.fillStyle(0x24131f, 1).fillRect(0, 0, s, s);
      g.fillStyle(0x6f4428, 1).fillRect(10, 4, 11, 10);
      g.fillStyle(0xf2c7a0, 1).fillRect(13, 6, 6, 5);
      g.fillStyle(0x3f8bff, 1).fillRect(8, 15, 14, 10);
      g.fillStyle(0x1f1b24, 1).fillRect(10, 25, 4, 4);
      g.fillStyle(0x1f1b24, 1).fillRect(18, 25, 4, 4);
      g.fillStyle(0xff8a4d, 1).fillRect(19, 14, 5, 5);
    });

    this.createPixelTexture('elder-rowan-front', (g, s) => {
      g.fillStyle(0x10161b, 1).fillRect(0, 0, s, s);
      g.fillStyle(0xc4ccc7, 1).fillCircle(16, 11, 9);
      g.fillStyle(0x7a5e47, 1).fillRect(10, 16, 12, 10);
      g.fillStyle(0xe8d8bb, 1).fillRect(12, 7, 8, 4);
      g.fillStyle(0x9da8b0, 1).fillRect(9, 0, 14, 6);
      g.fillStyle(0x4a3121, 1).fillRect(11, 25, 4, 4);
      g.fillStyle(0x4a3121, 1).fillRect(17, 25, 4, 4);
    });

    this.createPixelTexture('elder-rowan-side', (g, s) => {
      g.fillStyle(0x10161b, 1).fillRect(0, 0, s, s);
      g.fillStyle(0xb8c0bb, 1).fillCircle(15, 11, 8);
      g.fillStyle(0x71533e, 1).fillRect(10, 16, 13, 10);
      g.fillStyle(0xe8d8bb, 1).fillRect(12, 7, 7, 4);
      g.fillStyle(0x8c979f, 1).fillRect(11, 0, 13, 6);
      g.fillStyle(0x4a3121, 1).fillRect(11, 25, 4, 4);
      g.fillStyle(0x4a3121, 1).fillRect(18, 25, 4, 4);
    });

    this.createPixelTexture('ash-wolf', (g, s) => {
      g.fillStyle(0x11151b, 1).fillRect(0, 0, s, s);
      g.fillStyle(0x8a6450, 1).fillRect(5, 12, 22, 10);
      g.fillStyle(0xba8262, 1).fillRect(8, 7, 6, 6);
      g.fillStyle(0xba8262, 1).fillRect(18, 7, 6, 6);
      g.fillStyle(0xe6d0a8, 1).fillRect(22, 14, 4, 4);
      g.fillStyle(0xe6d0a8, 1).fillRect(6, 14, 4, 4);
    });

    this.createPixelTexture('chest', (g, s) => {
      g.fillStyle(0x18110e, 1).fillRect(0, 0, s, s);
      g.fillStyle(0x8a5627, 1).fillRect(5, 10, 22, 13);
      g.fillStyle(0xc89a46, 1).fillRect(5, 7, 22, 5);
      g.fillStyle(0x4a2c12, 1).fillRect(14, 13, 4, 7);
      g.fillStyle(0xf1dc89, 1).fillRect(12, 12, 8, 2);
    });

    this.createPixelTexture('shrine', (g, s) => {
      g.fillStyle(0x151821, 1).fillRect(0, 0, s, s);
      g.fillStyle(0x807772, 1).fillRect(6, 8, 20, 16);
      g.fillStyle(0xcfc0b0, 1).fillRect(11, 13, 10, 5);
      g.fillStyle(0xff8e58, 1).fillCircle(16, 9, 4);
      g.fillStyle(0x5b534f, 1).fillRect(8, 4, 16, 4);
    });

    this.fallbackTimer = this.time.delayedCall(5000, () => {
      if (this.scene.isActive('BootScene')) {
        this.scene.start('TitleScene');
      }
    });

    this.scene.start('TitleScene');

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.fallbackTimer?.remove(false);
    });
  }
}
