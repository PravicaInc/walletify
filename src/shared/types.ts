export interface PuzzleItem<T> {
  index: number;
  value: T;
}

export interface FeeEstimation {
  fee: number;
  fee_rate: number;
}

export interface FeeEstimationWithLevels extends FeeEstimation {
  level: EstimationsLevels;
}

export interface SelectedFee {
  fee?: string;
  level?: EstimationsLevels;
}
export enum EstimationsLevels {
  Low = 'Low',
  Middle = 'Standard',
  High = 'High',
  Custom = 'Custom',
}
