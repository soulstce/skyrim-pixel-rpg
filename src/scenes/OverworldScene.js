import { GAME_STATE, DIALOGUE, QUESTS } from '../data/gameData.js';
import InventorySystem from '../systems/InventorySystem.js';
import QuestSystem from '../systems/QuestSystem.js';
import DialogueSystem from '../systems/DialogueSystem.js';
import UISystem from '../systems/UISystem.js';

export default class OverworldScene extends Phaser.Scene {
  constructor() {
    super('OverworldScene');
  }

  create() {
    this.inventory = new InventorySystem(GAME_STATE);
    this.quests = new QuestSystem(GAME_STATE);
    this.dialogue = new DialogueSystem(this);
    this.ui = new UISystem(this);
    this.state = GAME_STATE;
    this.inDialogue = false;
    this.actionCooldown = false;

    this.buildWorld();
    this.buildPlayer();
    this.buildInteractiveElements();
    this.buildControls();
    this.bindInput();
    this.refreshUI();
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setBounds(0, 0, 1920, 1280);
  }

  buildWorld() {
    const g = this.add.graphics();
    g.fillStyle(0x2f2e44, 1).fillRect(0, 0, 1920, 1280);
    g.fillStyle(0x4d3f31, 1).fillRect(0, 650, 1920, 630);
    g.fillStyle(0x5a4a38, 1).fillRect(0, 720, 700, 220);
    g.fillStyle(0x6c563f, 1).fillRect(700, 650, 520, 160);
    g.fillStyle(0x41562f, 1).fillRect(1110, 420, 810, 860);
    g.fillStyle(0x79604a, 1).fillRect(780, 210, 360, 260);
    g.fillStyle(0x23322c, 1).fillRect(1180, 140, 640, 460);
    g.fillStyle(0x1f281b, 1).fillRect(1260, 80, 520, 360);

    this.add.text(120, 680, 'Cinder Hollow', { fontFamily: 'Arial', fontSize: '22px', color: '#ffe3a3' });
    this.add.text(1280, 90, 'North Path', { fontFamily: 'Arial', fontSize: '22px', color: '#d5f8a5' });
    this.add.text(830, 235, 'Shrine Ruins', { fontFamily: 'Arial', fontSize: '18px', color: '#ffae88' });

    this.physics.world.setBounds(0, 0, 1920, 1280);

    this.walls = this.physics.add.staticGroup();
    const makeWall = (x, y, w, h) => {
      const wall = this.add.rectangle(x, y, w, h, 0x000000, 0);
      this.physics.add.existing(wall, true);
      this.walls.add(wall);
    };

    // Town edges and path blockers.
    makeWall(960, 648, 1920, 8);
    makeWall(700, 550, 18, 300);
    makeWall(1250, 420, 20, 860);
    makeWall(770, 205, 20, 280);
    makeWall(1160, 145, 20, 250);
    makeWall(520, 920, 200, 40);
    makeWall(1540, 420, 120, 28);
    makeWall(1620, 118, 200, 24);
  }

  buildPlayer() {
    this.player = this.physics.add.sprite(GAME_STATE.player.x, GAME_STATE.player.y, 'player-kael');
    this.player.setSize(18, 18).setOffset(7, 10);
    this.player.setCollideWorldBounds(true);
    this.player.body.setMaxVelocity(180, 180);
    this.physics.add.collider(this.player, this.walls);

    this.anims.create({
      key: 'idle',
      frames: [{ key: 'player-kael' }],
      frameRate: 1,
      repeat: -1
    });
    this.player.play('idle');
  }

  buildInteractiveElements() {
    this.rowan = this.physics.add.staticSprite(420, 790, 'elder-rowan');
    this.rowan.setScale(1.1);
    this.add.text(360, 830, 'Elder Rowan', { fontFamily: 'Arial', fontSize: '14px', color: '#f9d38b' });

    this.shrineChest = this.physics.add.staticSprite(980, 300, 'chest');
    this.shrineChest.setScale(1.05);
    this.add.text(915, 335, 'Shrine Chest', { fontFamily: 'Arial', fontSize: '12px', color: '#ffd08c' });

    this.rowanZone = this.add.zone(420, 790, 90, 90);
    this.chestZone = this.add.zone(980, 300, 90, 90);
    this.shrineZone = this.add.zone(980, 300, 160, 160);
    this.northGate = this.add.zone(1380, 180, 280, 240);

    this.physics.add.existing(this.rowanZone, true);
    this.physics.add.existing(this.chestZone, true);
    this.physics.add.existing(this.shrineZone, true);
    this.physics.add.existing(this.northGate, true);

    if (!this.state.flags.ashWolfDefeated) {
      this.ashWolf = this.physics.add.staticSprite(1460, 260, 'ash-wolf');
      this.ashWolf.setScale(1.2);
      this.add.text(1418, 300, 'Ash Wolf', { fontFamily: 'Arial', fontSize: '12px', color: '#ffaaaa' });

      this.wolfZone = this.add.zone(1460, 260, 100, 100);
      this.physics.add.existing(this.wolfZone, true);
      this.physics.add.overlap(this.player, this.wolfZone, () => {
        this.canInteract = true;
        this.activeObject = 'wolf';
      });
    } else {
      this.add.text(1390, 300, 'Ash Wolf defeated', { fontFamily: 'Arial', fontSize: '12px', color: '#ffd08c' });
    }

    this.physics.add.overlap(this.player, this.rowanZone, () => {
      this.canTalk = true;
      this.activeNPC = 'rowan';
    });
    this.physics.add.overlap(this.player, this.chestZone, () => {
      this.canInteract = true;
      this.activeObject = 'chest';
    });
    this.physics.add.overlap(this.player, this.shrineZone, () => {
      this.canInteract = true;
      if (this.state.quests.ashesInTheShrine !== QUESTS.ashesInTheShrine.stages.complete) {
        this.activeObject = 'shrine';
      }
    });
  }

  buildControls() {
    this.ui.createMovementPad({
      up: () => this.moveIntent('up'),
      down: () => this.moveIntent('down'),
      left: () => this.moveIntent('left'),
      right: () => this.moveIntent('right'),
      action: () => this.handleAction()
    });
  }

  bindInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,E,I,SPACE');
    this.input.keyboard.on('keydown-E', () => this.handleAction());
    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.dialogue.visible) {
        this.dialogue.next();
      }
    });
    this.input.keyboard.on('keydown-I', () => this.toggleInventory());
  }

  moveIntent(dir) {
    if (this.inDialogue) return;
    this.lastTouchDir = dir;
  }

  handleAction() {
    if (this.inDialogue) {
      this.dialogue.next();
      return;
    }

    if (this.activeNPC === 'rowan') {
      this.talkToRowan();
      return;
    }

    if (this.activeObject === 'chest') {
      this.openChest();
      return;
    }

    if (this.activeObject === 'wolf') {
      this.enterBattle();
      return;
    }
  }

  talkToRowan() {
    const questStage = this.state.quests.ashesInTheShrine;
    if (questStage === QUESTS.ashesInTheShrine.stages.locked) {
      this.quests.acceptAshesQuest();
      this.dialogue.open({
        speaker: 'Elder Rowan',
        lines: DIALOGUE.elderRowanIntro
      });
    } else if (questStage === QUESTS.ashesInTheShrine.stages.active) {
      this.dialogue.open({ speaker: 'Elder Rowan', lines: DIALOGUE.elderRowanAfterAccept });
    } else if (questStage === QUESTS.ashesInTheShrine.stages.shardFound) {
      this.quests.completeAshesQuest();
      this.dialogue.open({
        speaker: 'Elder Rowan',
        lines: DIALOGUE.elderRowanAfterShard
      });
    } else {
      this.dialogue.open({ speaker: 'Elder Rowan', lines: ['The shrine rests. Cinder Hollow owes you, Kael.'] });
    }
    this.inDialogue = true;
    this.dialogue.onComplete = () => {
      this.inDialogue = false;
      this.refreshUI();
    };
  }

  openChest() {
    if (this.state.flags.relicShardFound) {
      this.dialogue.open({ speaker: 'Chest', lines: ['The chest is empty now.'] });
      this.inDialogue = true;
      this.dialogue.onComplete = () => { this.inDialogue = false; };
      return;
    }

    if (!this.quests.isActive() && !this.quests.isShardFound()) {
      this.dialogue.open({ speaker: 'Chest', lines: ['The shrine chest is sealed in soot.'] });
      this.inDialogue = true;
      this.dialogue.onComplete = () => { this.inDialogue = false; };
      return;
    }

    this.inventory.addItem({
      id: 'relic-shard',
      name: 'Relic Shard',
      type: 'quest',
      quantity: 1,
      description: 'A heat-laced fragment pulled from the shrine chest.'
    });
    this.state.flags.relicShardFound = true;
    this.quests.markShardFound();
    this.shrineChest.disableBody(true, true);
    this.dialogue.open({ speaker: 'Chest', lines: DIALOGUE.chestFound });
    this.inDialogue = true;
    this.dialogue.onComplete = () => {
      this.inDialogue = false;
      this.refreshUI();
    };
  }

  enterBattle() {
    this.state.sceneReturn = 'OverworldScene';
    this.scene.start('BattleScene', { enemy: 'ash-wolf' });
  }

  toggleInventory() {
    this.showInventory = !this.showInventory;
    if (this.showInventory) {
      const lines = this.inventory.asLines().join('\n');
      this.inventoryOverlay = this.inventoryOverlay ?? this.add.rectangle(630, 115, 300, 170, 0x0b1324, 0.92)
        .setStrokeStyle(2, 0xf9d38b, 0.8)
        .setScrollFactor(0)
        .setDepth(920);
      this.inventoryText = this.inventoryText ?? this.add.text(480, 45, '', {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#ffffff',
        wordWrap: { width: 260 }
      }).setScrollFactor(0).setDepth(930);
      this.inventoryText.setText(`Inventory\n${lines}`);
      this.inventoryOverlay.setVisible(true);
      this.inventoryText.setVisible(true);
    } else if (this.inventoryOverlay) {
      this.inventoryOverlay.setVisible(false);
      this.inventoryText.setVisible(false);
    }
  }

  refreshUI() {
    this.ui.updateVitals(this.state.player);
    const questText = this.quests.isComplete()
      ? 'Quest: Ashes in the Shrine — complete'
      : this.quests.isShardFound()
        ? 'Quest: Return the Relic Shard to Elder Rowan'
        : this.quests.isActive()
          ? 'Quest: Find the Relic Shard in the shrine'
          : 'Quest: Speak to Elder Rowan';
    this.ui.setQuestText(questText);
  }

  update() {
    if (this.inDialogue) {
      this.player.setVelocity(0);
      return;
    }

    this.canTalk = false;
    this.canInteract = false;
    this.activeNPC = null;
    this.activeObject = null;

    const speed = 140;
    let vx = 0;
    let vy = 0;

    const up = this.cursors.up.isDown || this.keys.W.isDown || this.lastTouchDir === 'up';
    const down = this.cursors.down.isDown || this.keys.S.isDown || this.lastTouchDir === 'down';
    const left = this.cursors.left.isDown || this.keys.A.isDown || this.lastTouchDir === 'left';
    const right = this.cursors.right.isDown || this.keys.D.isDown || this.lastTouchDir === 'right';

    if (up) vy -= 1;
    if (down) vy += 1;
    if (left) vx -= 1;
    if (right) vx += 1;

    const moving = vx !== 0 || vy !== 0;
    if (moving) {
      const len = Math.hypot(vx, vy) || 1;
      vx = (vx / len) * speed;
      vy = (vy / len) * speed;
      this.player.setVelocity(vx, vy);
    } else {
      this.player.setVelocity(0);
    }

    this.lastTouchDir = null;
    this.refreshUI();
  }
}
