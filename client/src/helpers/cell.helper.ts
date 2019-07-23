export interface Position {
    readonly rowIndex: number;
    readonly columnIndex: number;
}

export function getPositionByIndex(index: number, sideSize: number): Position {
    return {
        rowIndex: Math.floor(index/sideSize),
        columnIndex: index%sideSize
    };
}

export function calculateIndex({ rowIndex, columnIndex }: Position, sideSize: number): number {
    return rowIndex*sideSize + columnIndex;
}
