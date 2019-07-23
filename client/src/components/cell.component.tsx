import React from "react";
import { CellValues } from "../model/game.model";

interface CellProps {
    readonly value?: CellValues;
    onClick(): void;
}

export function CellComponent(props: CellProps): React.ReactElement {
    return (
        <button className="cell"
                onClick={props.onClick}>
            {props.value}
        </button>
    );
}
