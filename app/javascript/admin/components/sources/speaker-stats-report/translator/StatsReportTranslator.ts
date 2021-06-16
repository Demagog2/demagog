export class StatsReportTranslator {
  private TRANSLATIONS = {
    true: 'pravda {count}',
    untrue: 'nepravda {count}',
    misleading: 'zavádějící {count}',
    unverifiable: 'neověřitelné {count}',
    evaluated: '{count} se ještě ověřuje',
  };

  public translate(key: string, count: number): string {
    return this.TRANSLATIONS[key].replace('{count}', count);
  }
}
