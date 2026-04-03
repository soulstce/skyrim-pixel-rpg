import { GAME_STATE } from '../data/gameData.js';
import InventorySystem from '../systems/InventorySystem.js';
import UISystem from '../systems/UISystem.js';

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
  }

  init(data) {
    this.enemyKey = data.enemy ?? 'ash-wolf';
  }

  create() {
    this.state = GAME_STATE;
    this.inventory = new InventorySystem(this.state);
    this.ui = new UISystem(this);
    this.ui.createBattleButtons({
      attack: () => this.playerAttack(),
      ember: () => this.playerEmber(),
      potion: () => this.usePotion(),
      flee: () => this.flee()
    });

    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x130f18);
    this.add.rectangle(width / 2, height / 2 + 30, width, 220, 0x22171f);
    this.add.text(40, 60, 'Ash Wolf', { fontFamily: 'Arial', fontSize: '30px', color: '#ffb7a1' });
    this.add.text(40, 100, 'Turn-based combat in the ashfall.', { fontFamily: 'Arial', fontSize: '16px', color: '#d6dce8' });

    this.enemy = this.add.sprite(width * 0.72, height * 0.43, this.enemyKey).setScale(3);
    this.playerSprite = this.add.sprite(width * 0.22, height * 0.5, 'player-kael').setScale(3);

    this.playerPanel = this.add.rectangle(40, 170, 330, 150, 0x0b1324, 0.92).setStrokeStyle(2, 0x90b8ff, 0.7);
    this.enemyPanel = this.add.rectangle(width - 370, 170, 330, 150, 0x0b1324, 0.92).setStrokeStyle(2, 0xff8f8f, 0.7);

    this.playerStatus = this.add.text(58, 185, '', { fontFamily: 'Arial', fontSize: '16px', color: '#ffffff' });
    this.enemyStatus = this.add.text(width - 352, 185, '', { fontFamily: 'Arial', fontSize: '16px', color: '#ffffff' });

    this.logBox = this.add.rectangle(width / 2, height - 126, width - 40, 96, 0x07101a, 0.95)
      .setStrokeStyle(2, 0xf9d38b, 0.7);
    this.logText = this.add.text(28, height - 145, '', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#f2f5ff',
      wordWrap: { width: width - 60 }
    });

    this.turnLocked = false;
    this.playerTurn = true;
    this.player = this.state.player;
    this.enemyState = {
      name: 'Ash Wolf',
      maxHp: 18,
      hp: 18,
      attack: 4
    };
    this.refresh();
    this.log('The Ash Wolf snarls and circles Kael.');
    this.input.keyboard.on('keydown-ESC', () => this.flee());
  }

  refresh() {
    this.ui.updateVitals(this.player);
    this.playerStatus.setText([
      `Kael`,
      `HP ${this.player.hp}/${this.player.maxHp}`,
      `MP ${this.player.mp}/${this.player.maxMp}`,
      `Potion x${this.inventory.items.find((i) => i.id === 'potion')?.quantity ?? 0}`
    ]);
    this.enemyStatus.setText([
      this.enemyState.name,
      `HP ${Math.max(0, this.enemyState.hp)}/${this.enemyState.maxHp}`,
      this.playerTurn ? 'Kael acts first' : 'Wolf is preparing...'
    ]);
  }

  log(message) {
    this.logText.setText(message);
  }

  lockTurn() {
    this.turnLocked = true;
    this.ui.buttons.forEach((button) => button.list[0].disableInteractive());
  }

  unlockTurn() {
    this.turnLocked = false;
    this.ui.buttons.forEach((button) => button.list[0].setInteractive({ useHandCursor: true }));
  }

  playerAttack() {
    if (this.turnLocked || !this.playerTurn) return;
    this.lockTurn();
    const dmg = this.player.attack + Phaser.Math.Between(0, 3);
    this.enemyState.hp -= dmg;
    this.log(`Kael strikes with the rusted sword for ${dmg} damage.`);
    this.afterPlayerAction();
  }

  playerEmber() {
    if (this.turnLocked || !this.playerTurn) return;
    if (this.player.mp < 3) {
      this.log('Not enough MP for Ember.');
      return;
    }

    this.lockTurn();
    this.player.mp -= 3;
    const dmg = this.player.ember + Phaser.Math.Between(2, 5);
    this.enemyState.hp -= dmg;
    this.log(`Kael casts Ember for ${dmg} damage.`);
    this.afterPlayerAction();
  }

  usePotion() {
    if (this.turnLocked || !this.playerTurn) return;
    const potion = this.inventory.items.find((item) => item.id === 'potion');
    if (!potion || potion.quantity <= 0) {
      this.log('No potions left.');
      return;
    }

    this.lockTurn();
    this.inventory.removeItem('potion', 1);
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + 8);
    this.log('Kael drinks a potion and recovers health.');
    this.afterPlayerAction(false);
  }

  flee() {
    if (this.turnLocked) return;
    this.log('Kael slips back toward Cinder Hollow.');
    this.time.delayedCall(500, () => this.scene.start('OverworldScene'));
  }

  afterPlayerAction(consumeTurn = true) {
    this.refresh();
    if (this.enemyState.hp <= 0) {
      this.time.delayedCall(700, () => this.victory());
      return;
    }

    if (consumeTurn) {
      this.time.delayedCall(650, () => this.enemyTurn());
    } else {
      this.unlockTurn();
      this.refresh();
    }
  }

  enemyTurn() {
    const dmg = this.enemyState.attack + Phaser.Math.Between(0, 2);
    this.player.hp -= dmg;
    this.log(`The Ash Wolf lashes out for ${dmg} damage.`);
    this.refresh();

    if (this.player.hp <= 0) {
      this.time.delayedCall(900, () => {
        this.player.hp = this.player.maxHp;
        this.player.mp = this.player.maxMp;
        this.scene.start('OverworldScene');
      });
      return;
    }

    this.playerTurn = true;
    this.unlockTurn();
    this.refresh();
  }

  victory() {
    this.state.flags.ashWolfDefeated = true;
    this.log('Victory. The path ahead quiets down.');
    this.refresh();
    this.time.delayedCall(1200, () => this.scene.start('OverworldScene'));
  }
}
