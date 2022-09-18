import {
  IEnrichPerformance,
  IInvoice,
  IPerformance,
  IPlay,
  IPlays,
  IStatementData,
} from "./types";

class PerformanceCalculator {
  constructor(public performance: IPerformance, public play: IPlay) {}

  get amount() {
    let result = 0;
    switch (this.play.type) {
      case "tragedy":
        result = 40000;
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20);
        }
        break;
      default:
        throw new Error(`알 수 없는 장르: ${this.play.type}`);
    }
    return result;
  }

  get volumeCredits() {
    let result = 0;
    result += Math.max(this.performance.audience - 30, 0);
    if ("comedy" === this.play.type)
      result += Math.floor(this.performance.audience / 5);

    return result;
  }
}

export function createStatementData(
  invoice: IInvoice,
  plays: IPlays
): IStatementData {
  const result: any = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);
  return result as IStatementData;

  function enrichPerformance(aPerformance: IPerformance) {
    const calculator = new PerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    );
    const result: any = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;

    return result as IEnrichPerformance;
  }

  function playFor(aPerformance: IPerformance) {
    return plays[aPerformance.playID];
  }

  function totalAmount(data: { performances: IEnrichPerformance[] }) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }

  function totalVolumeCredits(data: { performances: IEnrichPerformance[] }) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }
}
