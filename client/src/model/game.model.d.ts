export interface GameModel extends GameItem, GameParameters {
    readonly stepsCount: number;
    readonly nextSymbol: CellSymbols;
    readonly cells: ReadonlyArray<CellValues>;
    readonly winner?: CellSymbols;
    readonly exists: boolean;
}

export interface GameItem {
    readonly id: number;
    readonly name: string;
}

export interface GameParameters {
    readonly sideSize: number;
    readonly symbolsToWin: number;
}

export type CellSymbols = "X" | "O";

export type CellValues = CellSymbols | undefined;
