import { GAME_STATE, QUESTS } from '../data/gameData.js';

export default class QuestSystem {
  constructor(state = GAME_STATE) {
    this.state = state;
  }

  get stage() {
    return this.state.quests.ashesInTheShrine;
  }

  acceptAshesQuest() {
    this.state.quests.ashesInTheShrine = QUESTS.ashesInTheShrine.stages.active;
  }

  markShardFound() {
    this.state.flags.relicShardFound = true;
    this.state.quests.ashesInTheShrine = QUESTS.ashesInTheShrine.stages.shardFound;
  }

  completeAshesQuest() {
    this.state.quests.ashesInTheShrine = QUESTS.ashesInTheShrine.stages.complete;
  }

  isActive() {
    return this.stage === QUESTS.ashesInTheShrine.stages.active;
  }

  isShardFound() {
    return this.stage === QUESTS.ashesInTheShrine.stages.shardFound;
  }

  isComplete() {
    return this.stage === QUESTS.ashesInTheShrine.stages.complete;
  }
}
