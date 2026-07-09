export class CPlayerState {
  #balance;
  #bet;
  #minBet;
  #maxBet;
  #betStep;
  constructor({ balance = 1000, bet = 10, minBet = 10, maxBet = 100, betStep = 10 } = {}) {
    this.#balance = balance;
    this.#minBet = minBet;
    this.#maxBet = maxBet;
    this.#betStep = betStep;
    this.#bet = this.normalizeBet(bet);
  }

  static fromServer(data = {}) {
    return new CPlayerState({
      balance: Number(data.balance ?? 0),
      bet: Number(data.bet ?? 10),
      minBet: Number(data.minBet ?? 10),
      maxBet: Number(data.maxBet ?? 100),
      betStep: Number(data.betStep ?? 10),
    });
  }

  canAffordBet() {
    return this.#balance >= this.#bet;
  }

  placeBet() {
    if (!this.canAffordBet()) {
      return false;
    }

    this.#balance -= this.#bet;
    return true;
  }

  setBet(amount) {
    this.#bet = this.normalizeBet(amount);
    return this.#bet;
  }

  increaseBet() {
    return this.setBet(this.#bet + this.#betStep);
  }

  decreaseBet() {
    return this.setBet(this.#bet - this.#betStep);
  }

  get bet() {
    return this.#bet;
  }

  get minBet() {
    return this.#minBet;
  }

  get maxBet() {
    return this.#maxBet;
  }

  get betStep() {
    return this.#betStep;
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

  normalizeBet(amount) {
    const value = Number(amount);

    if (!Number.isFinite(value)) {
      return this.#minBet;
    }

    return Math.min(this.#maxBet, Math.max(this.#minBet, value));
  }
}