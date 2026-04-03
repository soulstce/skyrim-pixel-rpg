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
    this.touchDirections = { up: false, down: false, left: false, right: false };
    this.lastFacing = 'down';
    this.activeInteractable = null;
    this.lastTouchButton = 'None';
    this.touchIsDown = false;

    this.handleWindowBlur = () => this.clearTouchDirections();
    this.input.setPollAlways(true);
    this.input.topOnly = false;
    this.game.canvas.style.touchAction = 'none';
    this.game.canvas.style.webkitTouchCallout = 'none';
    this.input.on('gameout', () => this.clearTouchDirections());
    this.input.on('pointercancel', () => this.clearTouchDirections());
    window.addEventListener('blur', this.handleWindowBlur);
    window.addEventListener('pagehide', this.handleWindowBlur);

    this.buildWorld();
    this.buildPlayer();
    this.buildInteractiveElements();
    this.buildControls();
    this.bindInput();
    this.ui.createDebugText();
    this.refreshUI();

    this.cameras.main.setBounds(0, 0, 1920, 1280);
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(120, 90);
    this.cameras.main.centerOn(this.player.x, this.player.y);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener('blur', this.handleWindowBlur);
      window.removeEventListener('pagehide', this.handleWindowBlur);
    });
  }

  buildWorld() {
    const worldW = 1920;
    const worldH = 1280;

    this.add.tileSprite(0, 0, worldW, worldH, 'grass-tile').setOrigin(0).setDepth(-20);
    this.add.tileSprite(60, 640, 760, 440, 'dirt-tile').setOrigin(0).setDepth(-18);
    this.add.tileSprite(720, 640, 360, 220, 'stone-path-tile').setOrigin(0).setDepth(-17);
    this.add.tileSprite(835, 150, 190, 980, 'stone-path-tile').setOrigin(0).setDepth(-17);
    this.add.tileSprite(1120, 145, 520, 470, 'grass-tile').setOrigin(0).setDepth(-19).setTint(0x2f4d24);
    this.add.tileSprite(1170, 70, 650, 380, 'grass-tile').setOrigin(0).setDepth(-19).setTint(0x355627);
    this.add.tileSprite(760, 220, 360, 300, 'dirt-tile').setOrigin(0).setDepth(-18).setTint(0x856042);
    this.add.tileSprite(1240, 60, 460, 150, 'stone-path-tile').setOrigin(0).setDepth(-18).setTint(0x8fa0a7);

    this.drawTownBorder();
    this.drawRoadDetails();
    this.drawEnvironment();
    this.drawLandmarks();

    this.physics.world.setBounds(0, 0, worldW, worldH);
    this.obstacles = this.physics.add.staticGroup();

    const addWall = (x, y, w, h) => {
      const wall = this.add.rectangle(x, y, w, h, 0x000000, 0);
      this.physics.add.existing(wall, true);
      this.obstacles.add(wall);
    };

    addWall(960, 630, 1920, 16);
    addWall(120, 700, 120, 72);
    addWall(355, 690, 120, 72);
    addWall(580, 690, 100, 72);
    addWall(900, 430, 220, 130);
    addWall(1320, 185, 600, 40);
    addWall(1100, 115, 260, 40);
  }

  drawTownBorder() {
    for (let x = 70; x < 850; x += 32) {
      this.add.image(x, 630, 'town-border-tile').setOrigin(0).setDepth(-15);
    }
    for (let y = 660; y < 980; y += 32) {
      this.add.image(70, y, 'town-border-tile').setOrigin(0).setDepth(-15).setAngle(90);
      this.add.image(810, y, 'town-border-tile').setOrigin(0).setDepth(-15).setAngle(90);
    }
    for (let x = 70; x < 850; x += 32) {
      this.add.image(x, 960, 'town-border-tile').setOrigin(0).setDepth(-15);
    }
  }

  drawRoadDetails() {
    for (let y = 640; y < 1220; y += 32) {
      this.add.image(924, y, 'stone-path-tile').setOrigin(0).setDepth(-14).setScale(1.05, 1.0);
      this.add.image(964, y, 'stone-path-tile').setOrigin(0).setDepth(-14).setScale(1.05, 1.0);
    }
    for (let x = 760; x < 1100; x += 32) {
      this.add.image(x, 720, 'stone-path-tile').setOrigin(0).setDepth(-14).setScale(1.05, 1.0);
    }
    this.add.text(910, 170, 'North Road', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#e8f1ff'
    }).setDepth(5);
  }

  drawEnvironment() {
    const housePositions = [
      [140, 690, 1.05],
      [340, 704, 1.05],
      [560, 700, 1.05],
      [120, 860, 1],
      [370, 870, 1],
      [600, 860, 1]
    ];
    housePositions.forEach(([x, y, scale]) => {
      this.add.image(x, y, 'house').setOrigin(0, 0).setScale(scale).setDepth(3);
    });

    const treePositions = [
      [170, 520], [230, 560], [490, 540], [630, 520], [1500, 320], [1630, 380], [1750, 240],
      [1160, 680], [1410, 760], [1560, 870], [1720, 760]
    ];
    treePositions.forEach(([x, y]) => {
      this.add.image(x, y, 'tree').setOrigin(0.5, 0.75).setDepth(4);
    });

    const rockPositions = [[260, 760], [420, 780], [720, 820], [1320, 270], [1480, 540], [1540, 700]];
    rockPositions.forEach(([x, y]) => {
      this.add.image(x, y, 'rock').setOrigin(0.5, 0.7).setDepth(4);
    });

    for (let x = 96; x < 760; x += 42) {
      this.add.image(x, 620, 'fence').setOrigin(0, 0).setDepth(3);
    }
    for (let x = 96; x < 760; x += 42) {
      this.add.image(x, 1000, 'fence').setOrigin(0, 0).setDepth(3);
    }
    for (let y = 650; y < 980; y += 42) {
      this.add.image(84, y, 'fence').setOrigin(0, 0).setDepth(3).setAngle(90);
      this.add.image(770, y, 'fence').setOrigin(0, 0).setDepth(3).setAngle(90);
    }
  }

  drawLandmarks() {
    this.add.image(940, 312, 'shrine').setOrigin(0.5).setDepth(4).setScale(1.4);
    this.add.text(868, 350, 'Shrine Ruins', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffd4a1'
    }).setDepth(5);

    this.add.text(118, 672, 'Cinder Hollow', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#ffe8b4'
    }).setDepth(5);
  }

  buildPlayer() {
    this.player = this.physics.add.sprite(GAME_STATE.player.x, GAME_STATE.player.y, 'player-kael-down');
    this.player.setSize(14, 18).setOffset(9, 10);
    this.player.setCollideWorldBounds(true);
    this.player.setMaxVelocity(128, 128);
    this.player.setDrag(0, 0);
    this.player.body.setBounce(0);
    this.physics.add.collider(this.player, this.obstacles);
  }

  buildInteractiveElements() {
    this.rowan = this.physics.add.staticSprite(420, 790, 'elder-rowan-front').setScale(1.05);
    this.chest = this.physics.add.staticSprite(980, 300, 'chest').setScale(1.1);
    this.ashWolf = this.state.flags.ashWolfDefeated ? null : this.physics.add.staticSprite(1460, 260, 'ash-wolf').setScale(1.2);

    this.add.text(360, 832, 'Elder Rowan', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffe1a3'
    }).setDepth(5);
    this.add.text(920, 336, 'Shrine Chest', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ffd28d'
    }).setDepth(5);
    if (this.ashWolf) {
      this.add.text(1418, 301, 'Ash Wolf', {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#ffb3a8'
      }).setDepth(5);
    }

    this.rowanZone = this.add.zone(420, 790, 94, 94);
    this.chestZone = this.add.zone(980, 300, 88, 88);
    this.wolfZone = this.add.zone(1460, 260, 100, 100);
    this.physics.add.existing(this.rowanZone, true);
    this.physics.add.existing(this.chestZone, true);
    this.physics.add.existing(this.wolfZone, true);

    this.physics.add.overlap(this.player, this.rowanZone, () => {
      this.activeInteractable = 'rowan';
    });
    this.physics.add.overlap(this.player, this.chestZone, () => {
      this.activeInteractable = 'chest';
    });
    if (this.ashWolf) {
      this.physics.add.overlap(this.player, this.wolfZone, () => {
        this.activeInteractable = 'wolf';
      });
    }
  }

  buildControls() {
    this.ui.createMovementPad({
      up: (pointer) => this.ui.startDirection('up', pointer),
      upEnd: (pointer) => this.ui.stopDirection('up', pointer),
      left: (pointer) => this.ui.startDirection('left', pointer),
      leftEnd: (pointer) => this.ui.stopDirection('left', pointer),
      down: (pointer) => this.ui.startDirection('down', pointer),
      downEnd: (pointer) => this.ui.stopDirection('down', pointer),
      right: (pointer) => this.ui.startDirection('right', pointer),
      rightEnd: (pointer) => this.ui.stopDirection('right', pointer),
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
    this.input.on('pointerdown', (pointer) => this.handleGlobalPointer('down', pointer));
    this.input.on('pointermove', (pointer) => this.handleGlobalPointer('move', pointer));
  }

  setTouchDirection(dir, enabled) {
    if (this.inDialogue) {
      return;
    }
    this.touchDirections[dir] = enabled;
    this.touchIsDown = enabled || this.touchDirections.up || this.touchDirections.down || this.touchDirections.left || this.touchDirections.right;
  }

  setLastTouchButton(label) {
    this.lastTouchButton = label;
  }

  clearTouchDirections() {
    this.touchDirections.up = false;
    this.touchDirections.down = false;
    this.touchDirections.left = false;
    this.touchDirections.right = false;
    this.touchIsDown = false;
  }

  handleGlobalPointer(type, pointer) {
    const button = this.ui.findHitButton(pointer);
    if (!button) {
      this.ui.setDebugText(`Pointers: ${this.input.pointers.length} | Last: ${this.lastTouchButton} | Touch Active: ${this.touchIsDown ? 'yes' : 'no'}`);
      return;
    }

    if (type === 'down') {
      this.lastTouchButton = button.name;
      this.touchIsDown = true;
      if (button.name === 'Action') {
        this.ui.flashButton('Action');
        this.handleAction();
      }
    }

    if (type === 'move') {
      this.touchIsDown = true;
      this.lastTouchButton = button.name;
    }

    this.ui.setDebugText(`Pointers: ${this.input.pointers.length} | Last: ${this.lastTouchButton} | Touch Active: ${this.touchIsDown ? 'yes' : 'no'}`);
  }

  isDown(key) {
    return Boolean(key?.isDown);
  }

  handleAction() {
    if (this.inDialogue) {
      this.dialogue.next();
      return;
    }

    if (this.activeInteractable === 'rowan') {
      this.talkToRowan();
      return;
    }

    if (this.activeInteractable === 'chest') {
      this.openChest();
      return;
    }

    if (this.activeInteractable === 'wolf') {
      this.enterBattle();
    }
  }

  talkToRowan() {
    const questStage = this.state.quests.ashesInTheShrine;
    if (questStage === QUESTS.ashesInTheShrine.stages.locked) {
      this.quests.acceptAshesQuest();
      this.state.flags.elderRowanMet = true;
      this.dialogue.open({ speaker: 'Elder Rowan', lines: DIALOGUE.elderRowanIntro });
    } else if (questStage === QUESTS.ashesInTheShrine.stages.active) {
      this.dialogue.open({ speaker: 'Elder Rowan', lines: DIALOGUE.elderRowanAfterAccept });
    } else if (questStage === QUESTS.ashesInTheShrine.stages.shardFound) {
      this.quests.completeAshesQuest();
      this.dialogue.open({ speaker: 'Elder Rowan', lines: DIALOGUE.elderRowanAfterShard });
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
      this.dialogue.onComplete = () => {
        this.inDialogue = false;
      };
      return;
    }

    if (!this.quests.isActive() && !this.quests.isShardFound()) {
      this.dialogue.open({ speaker: 'Chest', lines: ['The shrine chest is sealed in soot.'] });
      this.inDialogue = true;
      this.dialogue.onComplete = () => {
        this.inDialogue = false;
      };
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
    this.chest.setVisible(false);
    this.chest.body.enable = false;
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
      this.inventoryOverlay = this.inventoryOverlay ?? this.add.rectangle(610, 110, 300, 172, 0x0b1324, 0.92)
        .setStrokeStyle(2, 0xf9d38b, 0.75)
        .setScrollFactor(0)
        .setDepth(920);
      this.inventoryText = this.inventoryText ?? this.add.text(462, 40, '', {
        fontFamily: 'Arial',
        fontSize: '15px',
        color: '#ffffff',
        wordWrap: { width: 270 }
      }).setScrollFactor(0).setDepth(930);
      this.inventoryOverlay.setVisible(true);
      this.inventoryText.setText(`Inventory\n${lines}`);
      this.inventoryText.setVisible(true);
    } else if (this.inventoryOverlay) {
      this.inventoryOverlay.setVisible(false);
      this.inventoryText.setVisible(false);
    }
  }

  refreshUI() {
    this.ui.updateVitals(this.state.player);
    const questText = this.quests.isComplete()
      ? 'Ashes in the Shrine — complete'
      : this.quests.isShardFound()
        ? 'Return the Relic Shard to Elder Rowan'
        : this.quests.isActive()
          ? 'Find the Relic Shard in the shrine'
          : 'Speak to Elder Rowan';
    this.ui.setQuestText(questText);
    this.ui.setDebugText(`Pointers: ${this.input.pointers.length} | Last: ${this.lastTouchButton} | Touch Active: ${this.touchIsDown ? 'yes' : 'no'}`);
  }

  update() {
    const player = this.player;
    const left = this.isDown(this.cursors.left) || this.isDown(this.keys.A) || this.touchDirections.left;
    const right = this.isDown(this.cursors.right) || this.isDown(this.keys.D) || this.touchDirections.right;
    const up = this.isDown(this.cursors.up) || this.isDown(this.keys.W) || this.touchDirections.up;
    const down = this.isDown(this.cursors.down) || this.isDown(this.keys.S) || this.touchDirections.down;

    let vx = 0;
    let vy = 0;
    if (left) vx -= 1;
    if (right) vx += 1;
    if (up) vy -= 1;
    if (down) vy += 1;

    const moving = vx !== 0 || vy !== 0;
    if (moving) {
      const len = Math.hypot(vx, vy) || 1;
      vx = (vx / len) * 128;
      vy = (vy / len) * 128;
      player.setVelocity(vx, vy);

      if (Math.abs(vx) > Math.abs(vy)) {
        this.lastFacing = vx < 0 ? 'left' : 'right';
      } else {
        this.lastFacing = vy < 0 ? 'up' : 'down';
      }
    } else {
      player.setVelocity(0, 0);
    }

    const facingKey = this.lastFacing === 'up'
      ? 'player-kael-up'
      : this.lastFacing === 'down'
        ? 'player-kael-down'
        : 'player-kael-side';
    player.setTexture(facingKey);
    player.setFlipX(this.lastFacing === 'left');

    this.rowan.setTexture(this.inDialogue && this.activeInteractable === 'rowan' ? 'elder-rowan-front' : 'elder-rowan-side');
    this.rowan.setFlipX(player.x < this.rowan.x);

    this.refreshInteractableState();
    this.refreshUI();
  }

  refreshInteractableState() {
    if (this.inDialogue) {
      this.activeInteractable = null;
      this.ui.setInteractionPrompt('');
      return;
    }

    const promptRange = 72;
    const rowanDist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.rowan.x, this.rowan.y);
    const chestDist = (!this.state.flags.relicShardFound && this.chest?.active !== false)
      ? Phaser.Math.Distance.Between(this.player.x, this.player.y, this.chest.x, this.chest.y)
      : Number.POSITIVE_INFINITY;
    const wolfDist = this.ashWolf ? Phaser.Math.Distance.Between(this.player.x, this.player.y, this.ashWolf.x, this.ashWolf.y) : Number.POSITIVE_INFINITY;

    let prompt = '';
    this.activeInteractable = null;

    if (rowanDist < promptRange) {
      this.activeInteractable = 'rowan';
      prompt = 'Press Action';
    } else if (chestDist < promptRange) {
      this.activeInteractable = 'chest';
      prompt = 'Press Action';
    } else if (wolfDist < promptRange + 8) {
      this.activeInteractable = 'wolf';
      prompt = 'Press Action';
    }

    this.ui.setInteractionPrompt(prompt);
  }
}
