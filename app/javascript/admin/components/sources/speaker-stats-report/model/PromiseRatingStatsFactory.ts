import { Factory } from 'fishery';

class PromiseRatingStatsFactory extends Factory<
  Array<{ key: string; count: number }>,
  { broken: number; fulfilled: number; inProgress: number }
> {
  public broken(count: number) {
    return this.transient({ broken: count });
  }

  public fulfilled(count: number) {
    return this.transient({ fulfilled: count });
  }

  public inProgress(count: number) {
    return this.transient({ inProgress: count });
  }
}

export const promiseRatingStatsFactory = PromiseRatingStatsFactory.define(({ transientParams }) => [
  { key: 'broken', count: transientParams.broken ?? 0 },
  { key: 'fulfilled', count: transientParams.fulfilled ?? 0 },
  { key: 'in_progress', count: transientParams.inProgress ?? 0 },
  { key: 'partially_fulfilled', count: 0 },
  { key: 'stalled', count: 0 },
  { key: 'not_yet_evaluated', count: 0 },
  { key: 'evaluated', count: 0 },
]);
