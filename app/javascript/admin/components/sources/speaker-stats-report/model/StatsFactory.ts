import { Factory } from 'fishery';

class StatsFactory extends Factory<
  Array<{ key: string; count: number }>,
  { true: number; untrue: number; beingEvaluated: number }
> {
  public true(count: number) {
    return this.transient({ true: count });
  }

  public untrue(count: number) {
    return this.transient({ untrue: count });
  }

  public beingEvaluated(count: number) {
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
