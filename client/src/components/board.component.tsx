import React from "react";
import { CellComponent } from "./cell.component";
import { calculateIndex } from "../helpers/cell.helper";
import { CellValues } from "../model/game.model";

interface BoardProps {
    readonly cells: ReadonlyArray<CellValues>;
    readonly sideSize: number;
    onMove(index: number): void;
}

export class BoardComponent extends React.Component<BoardProps> {
    public render(): React.ReactElement {
        return (<div>
            { arrayOfSize(this.props.sideSize).map(idx => this.renderRow(idx)) }
        </div>);
    }

    private renderRow(rowIndex: number): React.ReactElement {
        return (<div className="board-row" key={rowIndex}>
            { arrayOfSize(this.props.sideSize).map(idx => this.renderCell(rowIndex, idx)) }
        </div>);
    }

    private renderCell(rowIndex: number, columnIndex: number): React.ReactElement {
        const cellIndex = calculateIndex({ rowIndex, columnIndex }, this.props.sideSize);
        return (<CellComponent key={cellIndex}
                      value={this.props.cells[cellIndex]}
                      onClick={() => this.props.onMove(cellIndex)}/>);
    }
}

function arrayOfSize(size: number): number[] {
    return Array.from(new Array(size).keys());
}
