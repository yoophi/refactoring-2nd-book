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
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;
  for (let perf of invoice.performances) {
    volumeCredits += Math.max(perf.audience - 30, 0);
    if ("comedy" === playFor(perf).type)
      volumeCredits += Math.floor(perf.audience / 5);

    result += ` ${playFor(perf).name}: ${format(
      amountFor(perf, playFor(perf)) / 100
    )} (${perf.audience}석\n`;
    totalAmount += amountFor(perf, playFor(perf));
  }

  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;

  function playFor(aPerformance: IPerformance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance: IPerformance, play: IPlay) {
    let result = 0;
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
