export function createStatementData(invoice: any, plays: any) {
    const result: any = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result)
    result.totalVolumeCredits = totalVolumeCredits(result)
    return result;

    function enrichPerformance(aPerformance: any) {
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result)
        result.amount = amountFor(result)
        result.volumeCredits = volumeCreditsFor(result)
        return result;
    }

    function totalAmount(data: any) {
        return data.performances.reduce((total: number, p: any) => {
            return total + p.amount
        }, 0)
    }

    function totalVolumeCredits(data: any) {
        return data.performances.reduce((total: number, p: any) => {
            return total + p.volumeCredits
        }, 0)
    }


    function volumeCreditsFor(aPerformance: any) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === aPerformance.play.type)
            result += Math.floor(aPerformance.audience / 5);

        return result;
    }

    function playFor(perf: any) {
        return plays[perf.playID];
    }

    function amountFor(aPerformance: any) {
        let result = 0;
        switch (playFor(aPerformance).type) {
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
                throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
        }
        return result;
    }
}