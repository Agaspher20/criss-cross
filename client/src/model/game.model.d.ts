export interface GameModel extends GameItem, GameParameters {
    readonly stepsCount: number;
    readonly nextSymbol: CellSymbols;
    readonly cells: ReadonlyArray<CellValues>;
    readonly exists: boolean;
    readonly loading: boolean;
    readonly pendingMove?: GameMove;
    readonly winnerSymbol?: CellSymbols;
    readonly winnerName?: string;
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
    readonly id: string;
    readonly name: string;
}

export interface GameParameters {
    readonly sideSize: number;
    readonly symbolsToWin: number;
}

export interface GameMove extends StoredGameMove {
    readonly gameId: string;
}

export interface StoredGameMove {
    readonly userId: string;
    readonly cellIndex: number;
    readonly symbol: CellSymbols;
    readonly winnerName?: string;
}

export type CellSymbols = "X" | "O";

export type CellValues = CellSymbols | undefined;
