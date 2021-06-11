import { Factory } from 'fishery';

class StatsFactory extends Factory<
  { key: string; count: number }[],
  { true: number; untrue: number; beingEvaluated: number }
> {
  true(count: number) {
    return this.transient({ true: count });
  }

  untrue(count: number) {
    return this.transient({ untrue: count });
  }

  beingEvaluated(count: number) {
    return this.transient({ beingEvaluated: count });
  }
}

export const statsFactory = StatsFactory.define(({ transientParams }) => [
  { key: 'true', count: transientParams.true ?? 0 },
  { key: 'untrue', count: transientParams.untrue ?? 0 },
  { key: 'misleading', count: 0 },
  { key: 'unverifiable', count: 0 },
  { key: 'evaluated', count: transientParams.beingEvaluated ?? 0 },
]);
