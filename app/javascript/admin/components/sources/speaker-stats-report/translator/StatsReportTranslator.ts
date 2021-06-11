export class StatsReportTranslator {
  private TRANSLATIONS = {
    true: 'pravda {count}',
    untrue: 'nepravda {count}',
    misleading: 'zavádějící {count}',
    unverifiable: 'neověřitelné {count}',
    evaluated: '{count} se ještě ověřuje',
  };

  translate(key: string, count: number): string {
    return this.TRANSLATIONS[key].replaceAll('{count}', count);
  }
}
