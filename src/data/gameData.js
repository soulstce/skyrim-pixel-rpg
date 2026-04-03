export const GAME = {
  title: 'Lucent RPG',
  hero: {
    name: 'Kael',
    role: 'scavenger',
    magic: 'fire'
  }
};

export const WORLD = {
  width: 1920,
  height: 1280,
  town: {
    name: 'Cinder Hollow'
  },
  path: {
    name: 'North Path'
  }
};

export const PLAYER_BASE = {
  maxHp: 24,
  hp: 24,
  maxMp: 12,
  mp: 12,
  attack: 5,
  ember: 7,
  defense: 1,
  x: 220,
  y: 820
};

export const INITIAL_INVENTORY = [
  { id: 'rusted-sword', name: 'Rusted Sword', type: 'weapon', quantity: 1, description: 'A worn blade that still bites.' },
  { id: 'worn-tunic', name: 'Worn Tunic', type: 'armor', quantity: 1, description: 'Travel-stained cloth stitched for survival.' },
  { id: 'potion', name: 'Potion', type: 'consumable', quantity: 2, description: 'A common healing draught.' }
];

export const QUESTS = {
  ashesInTheShrine: {
    id: 'ashes-in-the-shrine',
    title: 'Ashes in the Shrine',
    description: 'Elder Rowan asks Kael to recover the Relic Shard from the shrine ruins north of town.',
    stages: {
      locked: 'locked',
      active: 'active',
      shardFound: 'shardFound',
      complete: 'complete'
    }
  }
};

export const GAME_STATE = {
  player: structuredClone(PLAYER_BASE),
  inventory: structuredClone(INITIAL_INVENTORY),
  quests: {
    ashesInTheShrine: QUESTS.ashesInTheShrine.stages.locked
  },
  flags: {
    elderRowanMet: false,
    relicShardFound: false,
    ashWolfDefeated: false
  },
  sceneReturn: 'OverworldScene'
};

export const DIALOGUE = {
  elderRowanIntro: [
    'The shrine has gone silent again.',
    'Kael, I need a scavenger with steady hands.',
    'Take this quest: Ashes in the Shrine. Recover the Relic Shard from the ruin to the north, then return to me.'
  ],
  elderRowanAfterAccept: [
    'North of Cinder Hollow lies the old shrine.',
    'The Relic Shard should still be inside the chest there.',
    'Watch for the Ash Wolf on the path.'
  ],
  elderRowanAfterShard: [
    'You found it. The shard still carries heat.',
    'The shrine can rest a little longer.',
    'Thank you, Kael.'
  ],
  chestFound: [
    'Inside the chest, a shard hums with ember-light.'
  ],
  wolfVictory: [
    'The Ash Wolf collapses into drifting sparks.'
  ]
};
