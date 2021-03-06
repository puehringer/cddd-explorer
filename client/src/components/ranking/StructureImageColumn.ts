import { StringColumn, IDataRow, IStringFilter, equal, Column } from "lineupjs";

export interface IStructureFilter extends IStringFilter {
  filter: string;
  valid: Set<string>;
}

export class StructureImageColumn extends StringColumn {
  protected structureFilter: IStructureFilter | null = null;

  filter(row: IDataRow): boolean {
    if (!this.isFiltered()) {
      return true;
    }
    return this.structureFilter!.valid.has(this.getLabel(row));
  }

  isFiltered(): boolean {
    return this.structureFilter != null && this.structureFilter.valid?.size > 0;
  }

  getFilter() {
    return this.structureFilter;
  }

  setFilter(filter: IStructureFilter | null) {
    if (equal(filter, this.structureFilter)) {
      return;
    }

    this.fire(
      [StringColumn.EVENT_FILTER_CHANGED, Column.EVENT_DIRTY_VALUES, Column.EVENT_DIRTY],
      this.structureFilter,
      (this.structureFilter = filter)
    );
  }
}
