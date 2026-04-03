export default class UISystem {
  constructor(scene) {
    this.scene = scene;
    this.buttons = [];
    this.directionPointers = new Map();
    this.createBaseHUD();
  }

  createBaseHUD() {
    const { width, height } = this.scene.scale;

    this.hudPanel = this.scene.add.rectangle(12, 10, 258, 74, 0x08111f, 0.78)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0x43577b, 0.85)
      .setScrollFactor(0)
      .setDepth(900);

    this.questPanel = this.scene.add.rectangle(width - 348, 10, 336, 74, 0x08111f, 0.78)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0x5a744a, 0.85)
      .setScrollFactor(0)
      .setDepth(900);

    this.topLeft = this.scene.add.container(12, 10).setScrollFactor(0).setDepth(901);

    this.questText = this.scene.add.text(width - 332, 18, '', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ebffbf',
      wordWrap: { width: 302 }
    }).setScrollFactor(0).setDepth(901);

    this.hpLabel = this.scene.add.text(0, 0, 'HP', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#f6f7fb'
    });
    this.hpBarBg = this.scene.add.rectangle(32, 10, 176, 15, 0x1c2433).setOrigin(0, 0);
    this.hpBar = this.scene.add.rectangle(32, 10, 176, 15, 0xd95757).setOrigin(0, 0);
    this.hpValue = this.scene.add.text(214, -1, '', {
      fontFamily: 'Arial',
      fontSize: '13px',
      color: '#ffd9d9'
    });

    this.mpLabel = this.scene.add.text(0, 26, 'MP', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#f6f7fb'
    });
    this.mpBarBg = this.scene.add.rectangle(32, 36, 176, 15, 0x1c2433).setOrigin(0, 0);
    this.mpBar = this.scene.add.rectangle(32, 36, 176, 15, 0x4a86ff).setOrigin(0, 0);
    this.mpValue = this.scene.add.text(214, 25, '', {
      fontFamily: 'Arial',
      fontSize: '13px',
      color: '#dbe8ff'
    });

    this.promptPanel = this.scene.add.rectangle(width / 2, height - 104, 170, 36, 0x0a1323, 0.9)
      .setStrokeStyle(2, 0xf0c46c, 0.9)
      .setScrollFactor(0)
      .setDepth(905)
      .setVisible(false);
    this.promptText = this.scene.add.text(width / 2, height - 104, '', {
      fontFamily: 'Arial',
      fontSize: '15px',
      color: '#fff1c8'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(906).setVisible(false);

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
    this.hpBar.width = 176 * hpPct;
    this.mpBar.width = 176 * mpPct;
    this.hpValue.setText(`${hp}/${maxHp}`);
    this.mpValue.setText(`${mp}/${maxMp}`);
  }

  setQuestText(text) {
    this.questText.setText(text);
  }

  setInteractionPrompt(text) {
    const visible = Boolean(text);
    this.promptPanel.setVisible(visible);
    this.promptText.setVisible(visible);
    if (visible) {
      this.promptText.setText(text);
    }
  }

  clearButtons() {
    this.buttons.forEach((button) => button.destroy());
    this.buttons = [];
    this.directionPointers.clear();
  }

  startDirection(dir, pointer) {
    if (pointer?.event?.cancelable) {
      pointer.event.preventDefault?.();
    }
    this.directionPointers.set(pointer.id, dir);
    this.scene.setTouchDirection(dir, true);
  }

  stopDirection(dir, pointer) {
    if (pointer && this.directionPointers.get(pointer.id) !== dir) {
      return;
    }
    if (pointer) {
      this.directionPointers.delete(pointer.id);
    }
    this.scene.setTouchDirection(dir, false);
  }

  createPressedButton(x, y, size, label, tint, onDown, onUp) {
    const container = this.scene.add.container(x, y).setScrollFactor(0).setDepth(950);
    const bg = this.scene.add.ellipse(0, 0, size, size, tint, 0.94)
      .setStrokeStyle(2, 0xe8ebf1, 0.7);
    const hit = this.scene.add.rectangle(0, 0, size + 18, size + 18, 0xffffff, 0.001)
      .setInteractive({ useHandCursor: true });
    const inner = this.scene.add.ellipse(0, 0, size - 10, size - 10, 0xffffff, 0.08);
    const text = this.scene.add.text(0, 0, label, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5);

    hit.on('pointerdown', (pointer) => {
      container.setScale(0.94);
      onDown?.(pointer);
    });
    const release = (pointer) => {
      container.setScale(1);
      onUp?.(pointer);
    };
    hit.on('pointerup', release);
    hit.on('pointerout', release);
    hit.on('pointerupoutside', release);
    hit.on('pointercancel', release);

    container.add([bg, hit, inner, text]);
    this.buttons.push(container);
    return container;
  }

  createActionButton(x, y, label, tint, onClick) {
    const container = this.scene.add.container(x, y).setScrollFactor(0).setDepth(950);
    const bg = this.scene.add.ellipse(0, 0, 92, 54, tint, 0.95)
      .setStrokeStyle(2, 0xe8ebf1, 0.7);
    const hit = this.scene.add.rectangle(0, 0, 108, 70, 0xffffff, 0.001)
      .setInteractive({ useHandCursor: true });
    const text = this.scene.add.text(0, 0, label, {
      fontFamily: 'Arial',
      fontSize: '15px',
      color: '#ffffff'
    }).setOrigin(0.5);

    hit.on('pointerdown', (pointer) => {
      container.setScale(0.94);
      if (pointer?.event?.cancelable) {
        pointer.event.preventDefault?.();
      }
      onClick?.();
    });
    const release = () => container.setScale(1);
    hit.on('pointerup', release);
    hit.on('pointerout', release);
    hit.on('pointerupoutside', release);
    hit.on('pointercancel', release);

    container.add([bg, hit, text]);
    this.buttons.push(container);
    return container;
  }

  createMovementPad(callbacks = {}) {
    const baseX = 86;
    const baseY = this.scene.scale.height - 96;
    const size = 44;
    this.clearButtons();

    this.createPressedButton(baseX, baseY - size, size, '↑', 0x4a5b77, callbacks.up, callbacks.upEnd);
    this.createPressedButton(baseX - size, baseY, size, '←', 0x4a5b77, callbacks.left, callbacks.leftEnd);
    this.createPressedButton(baseX, baseY, size, '↓', 0x4a5b77, callbacks.down, callbacks.downEnd);
    this.createPressedButton(baseX + size, baseY, size, '→', 0x4a5b77, callbacks.right, callbacks.rightEnd);
    this.createActionButton(this.scene.scale.width - 104, baseY - 2, 'Action', 0x7b5132, callbacks.action);

    this.scene.input.setTopOnly(false);
  }

  createBattleButtons(callbacks = {}) {
    const y = this.scene.scale.height - 72;
    const startX = 220;
    this.clearButtons();
    this.createActionButton(startX + 0, y, 'Attack', 0x4c5f7c, callbacks.attack);
    this.createActionButton(startX + 130, y, 'Ember', 0x7b4a38, callbacks.ember);
    this.createActionButton(startX + 260, y, 'Potion', 0x3e714f, callbacks.potion);
    this.createActionButton(startX + 390, y, 'Flee', 0x7b3c3c, callbacks.flee);
  }
}
