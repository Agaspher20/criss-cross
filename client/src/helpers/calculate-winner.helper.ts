import { Position, getPositionByIndex, calculateIndex } from "./cell.helper";
import { GameParameters, CellValues, CellSymbols } from "../model/game.model";

type Move = (position: Position) => Position;

const moveLaws: ((p: Position) => Position)[][] = [
    [ // horizontal
        ({ rowIndex, columnIndex }: Position) => ({ rowIndex, columnIndex: columnIndex + 1 }),
        ({ rowIndex, columnIndex }: Position) => ({ rowIndex, columnIndex: columnIndex - 1 })
    ],
    [ // vertical
        ({ rowIndex, columnIndex }: Position) => ({ rowIndex: rowIndex + 1, columnIndex }),
        ({ rowIndex, columnIndex }: Position) => ({ rowIndex: rowIndex - 1, columnIndex })
    ],
    [ // main diagonal
        ({ rowIndex, columnIndex }: Position) => ({ rowIndex: rowIndex + 1, columnIndex: columnIndex + 1 }),
        ({ rowIndex, columnIndex }: Position) => ({ rowIndex: rowIndex - 1, columnIndex: columnIndex - 1 })
    ],
    [ // diagonal
        ({ rowIndex, columnIndex }: Position) => ({ rowIndex: rowIndex - 1, columnIndex: columnIndex + 1 }),
        ({ rowIndex, columnIndex }: Position) => ({ rowIndex: rowIndex + 1, columnIndex: columnIndex - 1 })
    ]
];

export function calculateWinner(
    symbol: CellSymbols,
    cells: ReadonlyArray<CellValues>,
    startIndex: number,
    parameters: GameParameters,
): CellValues {
    const position = getPositionByIndex(startIndex, parameters.sideSize);
    
    for(const moves of moveLaws) {
        let lineSymbolsCount = 1;
        for (const move of moves) {
            lineSymbolsCount = calculateSide(
                lineSymbolsCount,
                symbol,
                move,
                position,
                cells,
                parameters);
            if (lineSymbolsCount === parameters.symbolsToWin) {
                return symbol;
            }
        }
    }

    return undefined;
}

function calculateSide(
    startCount: number,
    symbol: CellSymbols,
    move: Move,
    position: Position,
    cells: ReadonlyArray<CellValues>,
    { symbolsToWin, sideSize }: GameParameters,
): number {
    let currentPosition: Position = move(position);
    let symbolsCount = startCount;

    while (positionInSquareBounds(currentPosition, sideSize) && symbolsCount < symbolsToWin) {
        const currentIndex = calculateIndex(currentPosition, sideSize);
        const currentCell = cells[currentIndex];

        if (currentCell === symbol) {
            ++symbolsCount;
        } else {
            break;
        }

        currentPosition = move(currentPosition);
    }

    return symbolsCount;
}

function positionInSquareBounds({ columnIndex, rowIndex }: Position, sideSize: number): boolean {
    return 0 <= columnIndex && columnIndex < sideSize && 0 <= rowIndex && rowIndex < sideSize;
}
