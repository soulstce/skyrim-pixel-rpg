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

    const begin = () => this.scene.start('OverworldScene');
    this.input.keyboard.once('keydown-SPACE', begin);
    this.input.once('pointerdown', begin);
  }
}
