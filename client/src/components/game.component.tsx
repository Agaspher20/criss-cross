import React from "react";
import { BoardComponent } from "./board.component";
import { GameModel, GameMove } from "../model/game.model";

export interface GameProps {
    model?: GameModel;
    userId?: string;
    onMove?: (move: GameMove) => void
}

export class GameComponent extends React.Component<GameProps> {
    private get model(): GameModel {
        return this.props.model!;
    }

    private get userId(): string {
        return this.props.userId!;
    }

    public render(): React.ReactElement {
        if (!this.model.exists) {
            return (<div className="game">
                <p>Game with name "{this.model.name || this.model.id}" was not found.</p>
            </div>);
        }

        const status = this.getStatus();
        
        return (
            <div className="game">
                <div className="game-board">
                    <div>{this.model.name}</div>
                    <div className="status">{status}</div>
                    <BoardComponent sideSize={this.model.sideSize}
                           cells={this.model.cells}
                           onMove={index => this.handleMove(index)} />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }

    private getStatus(): string {
        const { winnerName, winnerSymbol, stepsCount, nextSymbol, sideSize } = this.model;
        const maxStepsCount = sideSize * sideSize;
        return winnerSymbol
            ? `The winner is: ${winnerName || winnerSymbol}`
            : stepsCount < maxStepsCount
                ? `Current symbol: "${nextSymbol}"; Your symbol: "${this.getPlayerSymbol()}"`
                : "Game over";
    }

    private handleMove(cellIndex: number): void {
        if (this.props.onMove && this.canSetSymbol(cellIndex, this.model)) {
            this.props.onMove({
                gameId: this.model.id,
                cellIndex,
                symbol: this.model.nextSymbol,
                userId: this.props.userId!
            });
        }
    }

    private canSetSymbol(i: number, model: GameModel): boolean {
        return !model.cells[i] && !model.winnerSymbol && model.lastMoveId !== this.userId;
    }

    private getPlayerSymbol(): string {
        const { lastMoveId, nextSymbol } = this.model;
        return lastMoveId === this.userId ? (nextSymbol === "X" ? "O" : "X") : nextSymbol;
    }
}
