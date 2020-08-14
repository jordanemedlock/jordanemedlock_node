import React, { Component, useState } from 'react';
import {Player, Direction, Board, Point} from '../../common/models';
import {createGame, joinGame} from './api';
import _, { create } from 'underscore';
import io from 'socket.io-client';
import { Game } from '../../../../server/common/models';

const apiUrl = 'http://localhost:3000/api';

const TileComponent = (props) => {
    if (props.tile.isUnusable()) {
        return (
            <div className="unusable-tile tile"></div>
        )
    } else {
        let className = `${ props.tile.isDarkTile() ? 'dark-tile' : 'light-tile'} tile `;
        className += `${ props.isSource && 'source' } ${ props.isDestination && 'destination' } `;
        className += `${ props.isPossibleDestination && 'possible-destination' }`;
        return (
            <div className={className} onClick={props.onClick}>
                {props.tile.isNotEmpty() && (
                    <div className={`piece ${props.tile.name} ${props.tile.color} ${props.tile.direction}`}></div>
                )}
            </div>
        )
    }
}

class OldChessGame extends Component {
    constructor(props) {
        super(props)

        const players = [
            new Player('cyan', Direction.cardinal.UP),
            new Player('black', Direction.cardinal.RIGHT),
            new Player('white', Direction.cardinal.DOWN, true),
            new Player('red', Direction.cardinal.LEFT, true),
        ]
        const board = _.reduce(players, (b, p) => p.initPieces(b), new Board());
        this.state = {
            board,
            players: players,
            turn: 0,
            source: null,
            destination: null,
            possibleDestinations: {},
        }
    }

    currentPlayer() {
        return this.state.players[this.state.turn % this.state.players.length];
    }

    componentDidMount() {

    }

    canSelectPiece(tile) {
        return tile.color === this.currentPlayer().color;
    }

    canMoveToTile(tile) {
        return this.state.possibleDestinations[tile.location.toString()];
    }

    nextClicked() {
        this.setState((state) => ({
            ...state,
            board: state.board.movePiece(state.source, state.destination),
            source: null,
            destination: null, 
            possibleDestinations: {},
            turn: state.turn + 1
        }))
    }

    tileClicked(location) {
        const tile = this.state.board.getTile(location, Direction.cardinal.UP)
        if (this.state.source) {
            if (this.canMoveToTile(tile)) {
                this.setState((state) => ({
                    ...state,
                    destination: tile
                }))
            } else if (tile.isNotEmpty() && this.canSelectPiece(tile)) {
                this.setState((state) => ({
                    ...state,
                    source: tile,
                    possibleDestinations: tile.possibleDestinations(state.board),
                    destination: null,
                }))
            }
        } else if (tile.isNotEmpty() && this.canSelectPiece(tile)) { // has a piece there and you can click it 
            this.setState((state) => ({
                ...state,
                source: tile,
                possibleDestinations: tile.possibleDestinations(state.board),
                destination: null,
            }))
        }
    }

    render() {
        return (
            <div>
                <table className="four-person-chess">
                    <tbody>
                        {_.range(this.state.board.HEIGHT).map(y => (
                            <tr key={y}>
                                {_.range(this.state.board.WIDTH).map(x => {
                                    const point = new Point(x, y)
                                    return (
                                        <td key={x}>
                                            <TileComponent
                                                tile={this.state.board.getTile(point)}
                                                onClick={() => this.tileClicked(point)}
                                                isDarkTile={(x + y) % 2 === 0}
                                                isSource={this.state.source && this.state.source.location.toString() === point.toString()}
                                                isDestination={this.state.destination && this.state.destination.location.toString() === point.toString()}
                                                isPossibleDestination={!_.isUndefined(this.state.possibleDestinations[point.toString()])}
                                            />
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}

                    </tbody>
                </table>
                <button onClick={() => this.nextClicked()}>Next</button>
            </div>
        )
    }
}

class ChessGame extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <table className="four-person-chess">
                    <tbody>
                        {_.range(this.props.game.board.HEIGHT).map(y => (
                            <tr key={y}>
                                {_.range(this.props.game.board.WIDTH).map(x => {
                                    const point = new Point(x, y)
                                    return (
                                        <td key={x}>
                                            <TileComponent
                                                tile={this.props.game.board.getTile(point)}
                                                onClick={() => this.tileClicked(point)}
                                                isDarkTile={(x + y) % 2 === 0}
                                                isSource={this.props.game.source && this.props.game.source.location.toString() === point.toString()}
                                                isDestination={this.props.game.destination && this.props.game.destination.location.toString() === point.toString()}
                                                isPossibleDestination={!_.isUndefined(this.props.game.possibleDestinations[point.toString()])}
                                            />
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}

                    </tbody>
                </table>
                <button onClick={() => this.nextClicked()}>Next</button>
            </div>
        )
    }
}

class LogInScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            playerName: "",
            gameNumber: ""
        }
    }

    nameChanged = (event) => {
        this.setState({
            playerName: event.target.value
        })
    }

    gameChanged = (event) => {
        this.setState({
            gameNumber: event.target.value
        })
    }

    startNewGame = () => {
        this.props.startNewGame(this.state.playerName)
    }

    joinGame = () => {
        this.props.joinGame(this.state.gameNumber, this.state.playerName)
    }


    render() {
        return (
            <div>
                <div>
                    <h3>Start New Game</h3>
                    <input type="text" onChange={this.nameChanged} value={this.state.playerName} placeholder="Player Name" />
                    <input type="button" onClick={this.startNewGame} value="Start"/>
                </div>
                <div>
                    <h3>Join Game</h3>
                    <input type="text" onChange={this.gameChanged} value={this.state.gameNumber} placeholder="Game Number" />
                    <input type="text" onChange={this.nameChanged} value={this.state.playerName} placeholder="Player Name" />
                    <input type="button" onClick={this.joinGame} value="Join"/>
                </div>
            </div>
        )
    }
}


export class FourPersonChess extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loggedIn: false,
            socket: io()
        }
    }

    startNewGame = (playerName) => {
        fetch(apiUrl + '/game/create/' + playerName)
        .then(r => r.json())
        .then(g => Game.fromObject(g))
        .then(response => {
            this.setState({
                loggedIn: true,
                game: response,
                player: 0
            })
        },
        error => {
            // set some error idk
            console.log(error);
        })
    }

    joinGame = (gameNumber, playerName) => {
        // TODO: do api things
        this.setState({
            loggedIn: true
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.loggedIn ? 
                    <ChessGame game={this.state.game} player={this.state.player}/> :
                    <LogInScreen 
                        startNewGame={this.startNewGame}
                        joinGame={this.joinGame}
                    />
                }
            </div>
        )
    }
}