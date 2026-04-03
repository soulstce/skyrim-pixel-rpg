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

    this.add.text(width / 2, height / 2 + 20, 'Press Space or start the game button', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#8dc8ff'
    }).setOrigin(0.5);

    this.startTriggered = false;
    this.beginGame = () => {
      if (this.startTriggered) {
        return;
      }
      this.startTriggered = true;
      this.cleanupBeginListeners?.();
      this.scene.start('OverworldScene');
    };

    this.handleRegistryChange = (_parent, value) => {
      if (value) {
        this.beginGame();
      }
    };

    this.registry.events.on('changedata-gameStarted', this.handleRegistryChange);
    this.input.keyboard.once('keydown-SPACE', () => {
      this.registry.set('gameStarted', true);
    });

    if (this.registry.get('gameStarted')) {
      this.beginGame();
    }

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.registry.events.off('changedata-gameStarted', this.handleRegistryChange);
      this.cleanupBeginListeners?.();
    });
  }
}
