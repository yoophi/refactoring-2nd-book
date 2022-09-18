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

  get amount(): number | undefined {
    throw new Error("서브클래스에서 처리하도록 설계되었습니다.");
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    return result;
  }
  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}

function createPerformanceCalculator(aPerformance: IPerformance, aPlay: IPlay) {
  switch (aPlay.type) {
    case "tragedy":
      return new TragedyCalculator(aPerformance, aPlay);
    case "comedy":
      return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error(`알 수 없는 장르: ${aPlay.type}`);
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
    const calculator = createPerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    );

    const result: any = Object.assign({}, aPerformance);
    result.play = calculator.play;
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
