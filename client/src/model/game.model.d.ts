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
    readonly nextSymbol: CellSymbols;
    readonly lastMoveId?: string;
    readonly winnerSymbol?: CellSymbols;
    readonly winnerName?: string;
    readonly moves: ReadonlyArray<StoredGameMove>;
}

export interface GameItem {
    readonly id: number;
    readonly name: string;
}

export interface GameParameters {
    readonly sideSize: number;
    readonly symbolsToWin: number;
}

export interface GameMove extends StoredGameMove {
    readonly gameId: number;
}

export interface StoredGameMove {
    readonly userId: string;
    readonly cellIndex: number;
    readonly symbol: CellSymbols;
}

export type CellSymbols = "X" | "O";

export type CellValues = CellSymbols | undefined;
