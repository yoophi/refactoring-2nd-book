interface IPerformance {
  playID: string;
  audience: number;
}

interface IPerformanceWithPlay extends IPerformance {
  play: IPlay;
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
  const statementData: IStatementData = {
    customer: invoice.customer,
    performances: invoice.performances.map((performance) => {
      const play = playFor(performance);
      const amount = amountFor({ ...performance, play });
      const volumeCredits = volumeCreditsFor({ ...performance, play });
      const result: IPerformanceWithMeta = {
        ...performance,
        play,
        amount,
        volumeCredits,
      };
      return result;
    }),
  };

  return renderPlainText(statementData, invoice, plays);

  function renderPlainText(
    data: IStatementData,
    invoice: IInvoice,
    plays: IPlays
  ) {
    let result = `청구 내역 (고객명: ${data.customer})\n`;

    for (let perf of data.performances) {
      result += ` ${perf.play.name}: ${usd(perf.amount || 0)} (${
        perf.audience
      }석\n`;
    }
    result += `총액: ${usd(totalAmount())}\n`;
    result += `적립 포인트: ${totalVolumeCredits()}점\n`;
    return result;

    function totalAmount() {
      let result = 0;
      for (let perf of data.performances) {
        result += perf.amount;
      }
      return result;
    }

    function totalVolumeCredits() {
      let volumeCredits = 0;
      for (let perf of data.performances) {
        volumeCredits += perf.volumeCredits;
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
  }

  function playFor(aPerformance: IPerformance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance: IPerformanceWithPlay) {
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

  function volumeCreditsFor(perf: IPerformanceWithPlay) {
    let result = 0;
    result += Math.max(perf.audience - 30, 0);
    if ("comedy" === perf.play.type) result += Math.floor(perf.audience / 5);

    return result;
  }
}

import plays from "./plays.json";
import invoices from "./invoices.json";

console.log(statement(invoices[0], plays));
