export class StatsReportTranslator {
  private readonly TRANSLATIONS = {
    true: 'pravda {count}',
    untrue: 'nepravda {count}',
    misleading: 'zavádějící {count}',
    unverifiable: 'neověřitelné {count}',
    evaluated: '{count} se ještě ověřuje',

    fulfilled: 'splněno {count}',
    in_progress: 'průběžně plněno {count}',
    partially_fulfilled: 'částečně splněno {count}',
    broken: 'porušeno {count}',
    stalled: 'nerealizováno {count}',
    not_yet_evaluated: 'zatím nehodnoceno {count}',
  };

  public translate(key: string, count: number): string {
    return this.TRANSLATIONS[key].replace('{count}', count);
  }
}
