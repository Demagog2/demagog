import type { IStatementFilter } from '../model/filters/StatementFilter';
import type { Statement } from '../model/Statement';

export interface IFilterGroup {
  type: 'filter-group';
  label: string;
  filters: IFilterViewModel[];
}

export interface IFilterViewModel {
  type: 'filter';
  key: string;
  label: string;
  active: boolean;
}

export class FiltersViewModelBuilder {
  constructor(
    private readonly filters: IStatementFilter[],
    private readonly activeFilterKeys: string[],
    private readonly statements: Statement[],
  ) {}

  public buildViewModel(): Array<IFilterGroup | IFilterViewModel> {
    const filterGroups: Array<IFilterViewModel | IFilterGroup> = [];
    const groupsTraversed: string[] = [];

    for (const filter of this.filters) {
      const groupLabel = filter.getGroupLabel?.();

      if (groupLabel) {
        // Group for this filter was already created
        if (groupsTraversed.includes(groupLabel)) {
          continue;
        }

        // Create new group including this and all other filters belonging to this group
        const group = this.buildFilterGroup(
          groupLabel,
          this.filters.filter((f) => f.getGroupLabel?.() === groupLabel),
        );

        filterGroups.push(group);
        groupsTraversed.push(groupLabel);
      } else {
        // Standalone filter
        filterGroups.push(this.buildFilter(filter));
      }
    }

    return filterGroups;
  }

  private buildFilter(filter: IStatementFilter) {
    return {
      type: 'filter' as const,
      active: this.activeFilterKeys.includes(filter.getKey()),
      key: filter.getKey(),
      label: filter.getLabel(this.statements),
    };
  }

  private buildFilterGroup(label: string, filters: IStatementFilter[]): IFilterGroup {
    return {
      type: 'filter-group' as const,
      label,
      filters: filters.map((filter) => this.buildFilter(filter)),
    };
  }
}
