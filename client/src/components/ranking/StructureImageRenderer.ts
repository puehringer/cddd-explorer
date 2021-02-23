import {
  ICellRendererFactory,
  ERenderMode,
  ICellRenderer,
  IDataRow,
  IRenderContext,
  IGroupCellRenderer,
  IOrderedGroup,
  renderMissingDOM,
} from "lineupjs";
import { getImageURL, getReducedImages } from "../../utils/api";
import { StructureImageColumn } from "./StructureImageColumn";

const template =
  '<div style="background-size: contain; background-position: center; background-repeat: no-repeat;"></div>';

export class StructureImageRenderer implements ICellRendererFactory {
  readonly title: string = "Chemical Structure";

  canRender(col: StructureImageColumn, mode: ERenderMode): boolean {
    return (
      col instanceof StructureImageColumn &&
      (mode === ERenderMode.CELL || mode === ERenderMode.GROUP)
    );
  }

  create(col: StructureImageColumn): ICellRenderer {
    return {
      template,
      update: (n: HTMLImageElement, d: IDataRow) => {
        if (!renderMissingDOM(n, col, d)) {
          const value = col.getValue(d)!;
          n.style.backgroundImage = `url('${getImageURL(
            value,
            col.getFilter()?.filter
          )}')`;
          n.alt = value;
        }
      },
    };
  }

  createGroup(
    col: StructureImageColumn,
    context: IRenderContext
  ): IGroupCellRenderer {
    return {
      template,
      update: (n: HTMLImageElement, group: IOrderedGroup) => {
        context.tasks.groupRows(
          col,
          group,
          "StructureImageRendererGroup",
          (rows) => {
            getReducedImages(
              Array.from(rows.map((row) => col.getLabel(row)))
            ).then((res) => {
              n.style.backgroundImage = res
                ? `url('data:image/svg+xml;base64,${btoa(res)}')`
                : "";
            });
          }
        );
      },
    };
  }
}