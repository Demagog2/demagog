export interface IStatsReport {
  id: string;
  title: string;
  stats: Array<{
    key: string;
    count: number;
  }>;
}
