import React from "react";
import { BoardComponent } from "./board.component";
import { GameModel } from "../model/game.model";

export interface GameProps {
    name: string;
    model?: GameModel;
    onMove?: (index: number) => void
}

export class GameComponent extends React.Component<GameProps> {
    public render(): React.ReactElement {
        const model = this.props.model;
        const handleMove = this.props.onMove;

        if (!model || !handleMove) {
            return (<div className="game">
                <p>Game with name "{this.props.name}" was not found.</p>
            </div>);
        }

        const status = this.getStatus(model);
        
        return (
            <div className="game">
                <div className="game-board">
                    <div>{this.props.name}</div>
                    <div className="status">{status}</div>
                    <BoardComponent sideSize={model.sideSize}
                           cells={model.cells}
                           onMove={index => handleMove(index)} />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }

    private getStatus({ winner, stepsCount, nextSymbol, sideSize }: GameModel): string {
        const maxStepsCount = sideSize * sideSize;
        return winner
            ? `The winner is: ${winner}`
            : stepsCount < maxStepsCount
                ? `Next player: ${nextSymbol}`
                : "Game over";
    }
}
