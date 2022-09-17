import { IInvoice, IPlays, IStatementData } from "./types";
import plays from "./plays.json";
import invoices from "./invoices.json";
import { createStatementData } from "./createStatementData";

function statement(invoice: IInvoice, plays: IPlays) {
  const statementData = createStatementData(invoice, plays);

  return renderPlainText(statementData);

  function renderPlainText(data: IStatementData) {
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
}

console.log(statement(invoices[0], plays));
