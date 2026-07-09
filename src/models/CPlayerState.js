export class CPlayerState {
  #balance;
  #bet;
  constructor({ balance = 1000, bet = 10 } = {}) {
    this.#balance = balance;
    this.#bet = bet;
  }

  static fromServer(data = {}) {
    return new CPlayerState({
      balance: Number(data.balance ?? 0),
      bet: Number(data.bet ?? 10),
    });
  }

  get bet() {
    return this.#bet;
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