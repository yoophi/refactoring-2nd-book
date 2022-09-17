export interface IPerformance {
  playID: string;
  audience: number;
}

export interface IEnrichPerformance extends IPerformance {
  play: IPlay;
  amount: number;
  volumeCredits: number;
}

export interface IInvoice {
  customer: string;
  performances: IPerformance[];
}

export interface IPlay {
  type: string;
  name: string;
}

export interface IStatementData {
  customer: string;
  performances: IEnrichPerformance[];
  totalAmount: number;
  totalVolumeCredits: number;
}

export type IPlays = Record<string, IPlay>;
