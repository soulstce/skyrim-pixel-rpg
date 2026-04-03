export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x0b1020);
    this.add.text(width / 2, height / 2 - 90, 'Lucent RPG', {
      fontFamily: 'Arial',
      fontSize: '52px',
      color: '#ffe5a3',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 20, 'Kael the scavenger walks the ember road', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#c8d4ff'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 20, 'Press Space or tap to begin', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#8dc8ff'
    }).setOrigin(0.5);

    this.startTriggered = false;
    const begin = () => {
      if (this.startTriggered) {
        return;
      }
      this.startTriggered = true;
      this.cleanupBeginListeners?.();
      this.scene.start('OverworldScene');
    };

    const canvas = this.game.canvas;
    const onCanvasTouch = (event) => {
      event.preventDefault?.();
      begin();
    };

    this.input.keyboard.once('keydown-SPACE', begin);
    this.input.once('pointerdown', begin);

    if (canvas) {
      canvas.addEventListener('click', begin, { passive: true });
      canvas.addEventListener('touchend', onCanvasTouch, { passive: false });
      canvas.addEventListener('pointerdown', begin, { passive: true });

      this.cleanupBeginListeners = () => {
        canvas.removeEventListener('click', begin);
        canvas.removeEventListener('touchend', onCanvasTouch);
        canvas.removeEventListener('pointerdown', begin);
      };
    }

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanupBeginListeners?.();
    });
  }
}
