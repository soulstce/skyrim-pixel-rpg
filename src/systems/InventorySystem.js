import { GAME_STATE } from '../data/gameData.js';

export default class InventorySystem {
  constructor(state = GAME_STATE) {
    this.state = state;
  }

  get items() {
    return this.state.inventory;
  }

  hasItem(id, quantity = 1) {
    const item = this.state.inventory.find((entry) => entry.id === id);
    return Boolean(item && item.quantity >= quantity);
  }

  addItem(template) {
    const existing = this.state.inventory.find((entry) => entry.id === template.id);
    if (existing) {
      existing.quantity += template.quantity ?? 1;
      return existing;
    }

    const next = {
      id: template.id,
      name: template.name,
      type: template.type ?? 'misc',
      quantity: template.quantity ?? 1,
      description: template.description ?? ''
    };

    this.state.inventory.push(next);
    return next;
  }

  removeItem(id, quantity = 1) {
    const item = this.state.inventory.find((entry) => entry.id === id);
    if (!item || item.quantity < quantity) {
      return false;
    }

    item.quantity -= quantity;
    this.state.inventory = this.state.inventory.filter((entry) => entry.quantity > 0);
    return true;
  }

  asLines() {
    return this.state.inventory.map((entry) => `${entry.name} x${entry.quantity}`);
  }
}
