interface IPerformance {
  playID: string;
  audience: number;
}

interface IPerformanceWithMeta extends IPerformance {
  play: IPlay;
  amount: number;
  volumeCredits: number;
}

interface IInvoice {
  customer: string;
  performances: IPerformance[];
}

interface IPlay {
  type: string;
  name: string;
}

interface IStatementData {
  customer: string;
  performances: IPerformanceWithMeta[];
}

type IPlays = Record<string, IPlay>;

function statement(invoice: IInvoice, plays: IPlays) {
  const statementData: any = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);

  return renderPlainText(statementData, invoice, plays);

  function enrichPerformance(performance: IPerformance) {
    const result: any = Object.assign({}, performance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);

    return result as IPerformanceWithMeta;
  }

  function renderPlainText(data: any, invoice: IInvoice, plays: IPlays) {
    let result = `청구 내역 (고객명: ${data.customer})\n`;

    for (let perf of data.performances) {
      result += ` ${perf.play.name}: ${usd(perf.amount || 0)} (${
        perf.audience
      }석\n`;
    }
    result += `총액: ${usd(data.totalAmount)}\n`;
    result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
    return result;

    function usd(aNumber: number) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(aNumber / 100);
    }
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

  function totalAmount(data: any) {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.amount;
    }
    return result;
  }

  function totalVolumeCredits(data: any) {
    let volumeCredits = 0;
    for (let perf of data.performances) {
      volumeCredits += perf.volumeCredits;
    }
    return volumeCredits;
  }
}

import plays from "./plays.json";
import invoices from "./invoices.json";

console.log(statement(invoices[0], plays));
