export class CSequence {
  constructor(items) {
    if (!items || items.length === 0) {
      throw new Error("CSequence requires at least one item");
    }

    this.items = items;
  }

  get length() {
    return this.items.length;
  }

  at(index) {
    const len = this.items.length;
    const wrapped = ((index % len) + len) % len;
    return this.items[wrapped];
  }
}
