export class CPlayerState {
  #balance;
  constructor({ balance = 1000 } = {}) {
    this.#balance = balance;
  }

  static fromServer(data = {}) {
    return new CPlayerState({
      balance: Number(data.balance ?? 0),
    });
  }

  get balance() {
    return this.#balance;
  }

  addWin(amount) {
    this.#balance += amount;
    return this.balance;
  }

  setBalance(amount) {
    this.#balance = amount;
    return this.#balance;
  }
}