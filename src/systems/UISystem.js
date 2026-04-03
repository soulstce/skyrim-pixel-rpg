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
    this.directionPointers.forEach((dir) => {
      this.scene.setTouchDirection(dir, false);
    });
    this.directionPointers.clear();
    this.buttons.forEach((button) => button.destroy());
    this.buttons = [];
  }

  isPointerWithin(hit, pointer) {
    const bounds = hit.getBounds();
    return bounds.contains(pointer.x, pointer.y);
  }

  createTouchButton({ x, y, visualWidth, visualHeight, label, tint, depth = 100, onDown, onMove, onUp }) {
    const container = this.scene.add.container(x, y).setScrollFactor(0).setDepth(depth);
    const bg = this.scene.add.ellipse(0, 0, visualWidth, visualHeight, tint, 0.94)
      .setStrokeStyle(2, 0xe8ebf1, 0.7);

    const hitWidth = Math.round(visualWidth * 1.5);
    const hitHeight = Math.round(visualHeight * 1.5);
    const hit = this.scene.add.rectangle(-hitWidth / 2, -hitHeight / 2, hitWidth, hitHeight, 0xffffff, 0.001)
      .setOrigin(0)
      .setInteractive(new Phaser.Geom.Rectangle(0, 0, hitWidth, hitHeight), Phaser.Geom.Rectangle.Contains);

    const text = this.scene.add.text(0, 0, label, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const press = (pointer) => {
      container.setScale(0.94);
      if (pointer?.event?.cancelable) {
        pointer.event.preventDefault?.();
      }
      onDown?.(pointer, hit);
    };

    const move = (pointer) => {
      if (this.isPointerWithin(hit, pointer)) {
        container.setScale(0.94);
        onMove?.(pointer, hit);
      } else {
        release(pointer);
      }
    };

    const release = (pointer) => {
      container.setScale(1);
      onUp?.(pointer, hit);
    };

    hit.on('pointerdown', press);
    hit.on('pointermove', move);
    hit.on('pointerup', release);
    hit.on('pointerout', release);
    hit.on('pointercancel', release);

    container.add([bg, hit, text]);
    this.buttons.push(container);
    return { container, hit };
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
    } else {
      for (const [pointerId, currentDir] of this.directionPointers.entries()) {
        if (currentDir === dir) {
          this.directionPointers.delete(pointerId);
        }
      }
    }
    this.scene.setTouchDirection(dir, false);
  }

  createActionButton(x, y, label, tint, onClick) {
    return this.createTouchButton({
      x,
      y,
      visualWidth: 92,
      visualHeight: 54,
      label,
      tint,
      depth: 100,
      onDown: () => onClick?.(),
      onMove: () => {},
      onUp: () => {}
    });
  }

  createMovementPad(callbacks = {}) {
    const baseX = 86;
    const baseY = this.scene.scale.height - 96;
    const size = 44;
    this.clearButtons();

    this.createTouchButton({
      x: baseX,
      y: baseY - size,
      visualWidth: size,
      visualHeight: size,
      label: '↑',
      tint: 0x4a5b77,
      depth: 100,
      onDown: (pointer) => callbacks.up?.(pointer),
      onMove: (pointer) => callbacks.up?.(pointer),
      onUp: (pointer) => callbacks.upEnd?.(pointer)
    });

    this.createTouchButton({
      x: baseX - size,
      y: baseY,
      visualWidth: size,
      visualHeight: size,
      label: '←',
      tint: 0x4a5b77,
      depth: 100,
      onDown: (pointer) => callbacks.left?.(pointer),
      onMove: (pointer) => callbacks.left?.(pointer),
      onUp: (pointer) => callbacks.leftEnd?.(pointer)
    });

    this.createTouchButton({
      x: baseX,
      y: baseY,
      visualWidth: size,
      visualHeight: size,
      label: '↓',
      tint: 0x4a5b77,
      depth: 100,
      onDown: (pointer) => callbacks.down?.(pointer),
      onMove: (pointer) => callbacks.down?.(pointer),
      onUp: (pointer) => callbacks.downEnd?.(pointer)
    });

    this.createTouchButton({
      x: baseX + size,
      y: baseY,
      visualWidth: size,
      visualHeight: size,
      label: '→',
      tint: 0x4a5b77,
      depth: 100,
      onDown: (pointer) => callbacks.right?.(pointer),
      onMove: (pointer) => callbacks.right?.(pointer),
      onUp: (pointer) => callbacks.rightEnd?.(pointer)
    });

    this.createTouchButton({
      x: this.scene.scale.width - 104,
      y: baseY - 2,
      visualWidth: 92,
      visualHeight: 54,
      label: 'Action',
      tint: 0x7b5132,
      depth: 100,
      onDown: () => callbacks.action?.(),
      onMove: () => {},
      onUp: () => {}
    });

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
