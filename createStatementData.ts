import {
  IEnrichPerformance,
  IInvoice,
  IPerformance,
  IPlay,
  IPlays,
  IStatementData,
} from "./types";

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

  function enrichPerformance(performance: IPerformance) {
    const result: any = Object.assign({}, performance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);

    return result as IEnrichPerformance;
  }

  function playFor(aPerformance: IPerformance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance: IPerformance & { play: IPlay }) {
    let result = 0;
    switch (aPerformance.play.type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        break;
      default:
        throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`);
    }
    return result;
  }

  function volumeCreditsFor(perf: IPerformance & { play: IPlay }) {
    let result = 0;
    result += Math.max(perf.audience - 30, 0);
    if ("comedy" === perf.play.type) result += Math.floor(perf.audience / 5);

    return result;
  }

  function totalAmount(data: { performances: IEnrichPerformance[] }) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }

  function totalVolumeCredits(data: { performances: IEnrichPerformance[] }) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }
}
