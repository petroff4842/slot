export class CWinService {
  constructor(config) {
    this.config = config;
  }

  evaluate(spinResult) {
    const wins = [];

    for (
      let lineIndex = 0;
      lineIndex < this.config.paylines.length;
      lineIndex++
    ) {
      const line = this.config.paylines[lineIndex];
      const symbols = this.getLineSymbols(spinResult, line);
      const firstSymbol = symbols[0];

      let count = 1;

      for (let i = 1; i < symbols.length; i++) {
        if (symbols[i].id !== firstSymbol.id) {
          break;
        }

        count++;
      }

      if (count >= 3) {
        wins.push({
          lineIndex,
          line,
          symbol: firstSymbol,
          count,
          symbols,
        });
      }
    }

    return wins;
  }

  getLineSymbols(spinResult, line) {
    const symbols = [];

    for (let reelIndex = 0; reelIndex < line.length; reelIndex++) {
      const rowIndex = line[reelIndex];
      const reelItems = spinResult.reelAt(reelIndex);

      symbols.push(reelItems[rowIndex]);
    }

    return symbols;
  }
}
