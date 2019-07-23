export interface GameModel extends GameItem, GameParameters {
    readonly stepsCount: number;
    readonly nextSymbol: CellSymbols;
    readonly cells: ReadonlyArray<CellValues>;
    readonly winnerSymbol?: CellSymbols;
    readonly winnerName?: string;
    readonly exists: boolean;
    readonly loading: boolean;
    readonly lastMoveId?: string;
}

export interface GameDtoModel {
    readonly stepsCount: number;
    readonly nextSymbol: CellSymbols;
    readonly lastMoveId?: string;
    readonly winnerSymbol?: CellSymbols;
    readonly winnerName?: string;
    readonly cells: ReadonlyArray<[number, CellSymbols]>;
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
