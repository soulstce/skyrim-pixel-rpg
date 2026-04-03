export default class UISystem {
  constructor(scene) {
    this.scene = scene;
    this.buttons = [];
    this.createBaseHUD();
  }

  createBaseHUD() {
    const { width } = this.scene.scale;
    this.topLeft = this.scene.add.container(12, 10).setScrollFactor(0).setDepth(900);
    this.questText = this.scene.add.text(width - 320, 12, '', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#d5f8a5',
      align: 'right',
      wordWrap: { width: 300 }
    }).setScrollFactor(0).setDepth(900);

    this.hpLabel = this.scene.add.text(0, 0, 'HP', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff'
    });
    this.hpBarBg = this.scene.add.rectangle(34, 10, 170, 14, 0x1f2838).setOrigin(0, 0);
    this.hpBar = this.scene.add.rectangle(34, 10, 170, 14, 0xd95b5b).setOrigin(0, 0);
    this.hpValue = this.scene.add.text(212, -2, '', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ffdede'
    });

    this.mpLabel = this.scene.add.text(0, 24, 'MP', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff'
    });
    this.mpBarBg = this.scene.add.rectangle(34, 34, 170, 14, 0x1f2838).setOrigin(0, 0);
    this.mpBar = this.scene.add.rectangle(34, 34, 170, 14, 0x4e89ff).setOrigin(0, 0);
    this.mpValue = this.scene.add.text(212, 22, '', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#d8e6ff'
    });

    this.topLeft.add([
      this.hpLabel,
      this.hpBarBg,
      this.hpBar,
      this.hpValue,
      this.mpLabel,
      this.mpBarBg,
      this.mpBar,
      this.mpValue
    ]);
  }

  updateVitals({ hp, maxHp, mp, maxMp }) {
    const hpPct = Phaser.Math.Clamp(hp / maxHp, 0, 1);
    const mpPct = Phaser.Math.Clamp(mp / maxMp, 0, 1);
    this.hpBar.width = 170 * hpPct;
    this.mpBar.width = 170 * mpPct;
    this.hpValue.setText(`${hp}/${maxHp}`);
    this.mpValue.setText(`${mp}/${maxMp}`);
  }

  setQuestText(text) {
    this.questText.setText(text);
  }

  clearButtons() {
    this.buttons.forEach((button) => button.destroy());
    this.buttons = [];
  }

  createButton(x, y, w, h, label, onClick, tint = 0x2b3648) {
    const container = this.scene.add.container(x, y).setScrollFactor(0).setDepth(950);
    const bg = this.scene.add.rectangle(0, 0, w, h, tint, 0.88)
      .setStrokeStyle(2, 0xdce7ff, 0.7)
      .setInteractive({ useHandCursor: true });
    const text = this.scene.add.text(0, 0, label, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);

    bg.on('pointerdown', onClick);
    container.add([bg, text]);
    this.buttons.push(container);
    return container;
  }

  createMovementPad(callbacks = {}) {
    const baseX = 90;
    const baseY = this.scene.scale.height - 110;
    const size = 42;
    this.clearButtons();

    this.createButton(baseX, baseY - size, size, size, '↑', callbacks.up, 0x39485f);
    this.createButton(baseX - size, baseY, size, size, '←', callbacks.left, 0x39485f);
    this.createButton(baseX, baseY, size, size, '↓', callbacks.down, 0x39485f);
    this.createButton(baseX + size, baseY, size, size, '→', callbacks.right, 0x39485f);
    this.createButton(this.scene.scale.width - 110, baseY - 10, 90, 52, 'Action', callbacks.action, 0x5a3d2c);
  }

  createBattleButtons(callbacks = {}) {
    const y = this.scene.scale.height - 70;
    const startX = 225;
    this.clearButtons();
    this.createButton(startX + 0, y, 120, 44, 'Attack', callbacks.attack, 0x44556e);
    this.createButton(startX + 130, y, 120, 44, 'Ember', callbacks.ember, 0x6e4639);
    this.createButton(startX + 260, y, 120, 44, 'Potion', callbacks.potion, 0x3d6e54);
    this.createButton(startX + 390, y, 120, 44, 'Flee', callbacks.flee, 0x6e3d3d);
  }
}
