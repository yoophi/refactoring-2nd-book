interface IPerformance {
  playID: string;
  audience: number;
}

interface IInvoice {
  customer: string;
  performances: IPerformance[];
}

interface IPlay {
  type: string;
  name: string;
}

type IPlays = Record<string, IPlay>;

function statement(invoice: IInvoice, plays: IPlays) {
  let totalAmount = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;

  for (let perf of invoice.performances) {
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${
      perf.audience
    }석\n`;
    totalAmount += amountFor(perf);
  }

  result += `총액: ${usd(totalAmount)}\n`;
  result += `적립 포인트: ${totalVolumeCredits()}점\n`;
  return result;

  function totalVolumeCredits() {
    let volumeCredits = 0;
    for (let perf of invoice.performances) {
      volumeCredits += volumeCreditsFor(perf);
    }
    return volumeCredits;
  }

  function usd(aNumber: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber / 100);
  }

  function volumeCreditsFor(perf: IPerformance) {
    let result = 0;
    result += Math.max(perf.audience - 30, 0);
    if ("comedy" === playFor(perf).type)
      result += Math.floor(perf.audience / 5);

    return result;
  }

  function playFor(aPerformance: IPerformance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance: IPerformance) {
    let result = 0;
    const play = playFor(aPerformance);
    switch (play.type) {
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
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }
    return result;
  }
}

import plays from "./plays.json";
import invoices from "./invoices.json";

console.log(statement(invoices[0], plays));
