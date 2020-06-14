import React, { Component, useState } from 'react';
import _ from 'underscore';
import './FourPersonChess.css';

class Point {
    constructor(x, y) {
        if (!_.isNumber(x) || !_.isNumber(y) || _.isNaN(x) || _.isNaN(x)) {
            throw new TypeError(`${x} or ${y} arent valid numbers in Point`)
        }
        this.x = x
        this.y = y
    }

    add(point) {
        return new Point(this.x + point.x, this.y + point.y)
    }

    mult(val) {
        return new Point(this.x * val, this.y * val)
    }

    toString() {
        return `(${this.x}, ${this.y})`
    }
}

class Vector extends Point { } // Aliasing the class

class Direction {
    constructor(name, deltas) {
        this.name = name
        this.deltas = deltas
    }

    toString() {
        return this.name;
    }

    forward(point, n = 1) {
        return point.add(this.deltas.mult(n))
    }

    static switch(value, obj) {
        const func = obj[value.toString()];
        if (_.isFunction(func)) {
            return func(value);
        } else if (!_.isUndefined(func)) {
            return func;
        } else if (_.isFunction(obj['default'])) {
            return obj['default'](value);
        }
        return null;
    }

    static cardinal = {
        UP: new Direction("UP", new Vector(0, -1)),
        RIGHT: new Direction("RIGHT", new Vector(1, 0)),
        DOWN: new Direction("DOWN", new Vector(0, 1)),
        LEFT: new Direction("LEFT", new Vector(-1, 0))
    }

    static diagonals = {
        UP_LEFT: new Direction("UP_LEFT", new Vector(-1, -1)),
        UP_RIGHT: new Direction("UP_RIGHT", new Vector(1, -1)),
        DOWN_RIGHT: new Direction("DOWN_RIGHT", new Vector(1, 1)),
        DOWN_LEFT: new Direction("DOWN_LEFT", new Vector(-1, 1))
    }

    static allEight = {
        UP: new Direction("UP", new Vector(0, -1)),
        RIGHT: new Direction("RIGHT", new Vector(1, 0)),
        DOWN: new Direction("DOWN", new Vector(0, 1)),
        LEFT: new Direction("LEFT", new Vector(-1, 0)),

        UP_LEFT: new Direction("UP_LEFT", new Vector(-1, -1)),
        UP_RIGHT: new Direction("UP_RIGHT", new Vector(1, -1)),
        DOWN_RIGHT: new Direction("DOWN_RIGHT", new Vector(1, 1)),
        DOWN_LEFT: new Direction("DOWN_LEFT", new Vector(-1, 1)),
    }
}

//const colorValue = (name, hex) => Object.freeze({
//    toString: () => name,
//    name,
//    hex
//})

//const Colors = Object.freeze({
//    RED: colorValue("RED", "#FF0000"),
//    ORANGE: colorValue("ORANGE", "#FFAA00"),
//    YELLOW: colorValue("YELLOW", "#FFFF00"),
//    GREEN: colorValue("GREEN", "#00FF00"),
//    CYAN: colorValue("CYAN", "#00FFFF"),
//    BLUE: colorValue("BLUE", "#0000FF"),
//    WHITE: colorValue("WHITE", "#FFFFFF"),
//    BLACK: colorValue("")
//})

class Tile {
    constructor(location, usable, empty=true) {
        this.location = location
        this.usable = usable
        this.empty = empty
    }

    isUsable() {
        return this.usable
    }

    isUnusable() {
        return !this.usable
    }

    isEmpty() {
        return this.empty
    }

    isNotEmpty() {
        return !this.empty
    }

    isDarkTile() {
        return (this.location.x + this.location.y) % 2 === 0
    }
}

class Piece extends Tile {
    constructor(name, location, color, direction) {
        super(location, true, false);
        this.name = name
        this.color = color
        this.direction = direction
    }

    possibleDestinations(board) {
        return {};
    }

    moveTo(board, dest) {
        // TODO: I might want to implement this here, not sure yet
    }

    toString() {
        return this.name
    }
}

class Pawn extends Piece {
    constructor(location, color, direction) {
        super('pawn', location, color, direction)
        this.hasMoved = false; // pawn moves differently after the first move
    }

    possibleDestinations(board) {
        const localLoc = board.fromIndex(this.location, this.direction)
        let t1 = board.getTile(localLoc.add(new Vector(0, -1)), this.direction)
        let t2 = board.getTile(localLoc.add(new Vector(0, -2)), this.direction)
        let t3 = board.getTile(localLoc.add(new Vector(-1, -1)), this.direction)
        let t4 = board.getTile(localLoc.add(new Vector(1, -1)), this.direction)
        let ret = {}
        if (t1.isUsable() && t1.isEmpty()) {
            ret[t1.location.toString()] = t1;
            if (!this.hasMoved && t2.isUsable() && t2.isEmpty()) {
                ret[t2.location.toString()] = t2;
            }
        }
        if (t3.isUsable() && t3.isNotEmpty() && t3.color !== this.color) {
            ret[t3.location.toString()] = t3;
        }
        if (t4.isUsable() && t4.isNotEmpty() && t4.color !== this.color) {
            ret[t4.location.toString()] = t4;
        }

        return ret;
    }
}

class Knight extends Piece {
    constructor(location, color, direction) {
        super('knight', location, color, direction)
    }

    possibleDestinations(board) {
        const t1 = board.getTile(this.location.add(new Vector( 1,  2)));
        const t2 = board.getTile(this.location.add(new Vector( 1, -2)));
        const t3 = board.getTile(this.location.add(new Vector(-1, -2)));
        const t4 = board.getTile(this.location.add(new Vector(-1,  2)));

        const t5 = board.getTile(this.location.add(new Vector( 2,  1)));
        const t6 = board.getTile(this.location.add(new Vector( 2, -1)));
        const t7 = board.getTile(this.location.add(new Vector(-2, -1)));
        const t8 = board.getTile(this.location.add(new Vector(-2,  1)));

        let ret = {};
        _.each([t1, t2, t3, t4, t5, t6, t7, t8], (tile) => {
            if (tile.isUsable() && (tile.isEmpty() || tile.color !== this.color)) {
                ret[tile.location.toString()] = tile;
            }
        });
        return ret;
    }
}

const straightLineMoves = (color, directions, distance, location, board) => {
        var ret = {};
        _.each(directions, (dir) => {
            _.every(_.range(distance), (i) => {
                const newLocation = dir.forward(location, i + 1)
                const tile = board.getTile(newLocation)
                if (tile.isUsable() && tile.isEmpty()) {
                    ret[tile.location.toString()] = tile;
                    return true;
                } else if (tile.isUsable() && tile.isNotEmpty() && tile.color !== color) {
                    ret[tile.location.toString()] = tile;
                    return false;
                } else {
                    return false;
                }
            })
        })
        return ret;
}

class Bishop extends Piece {
    constructor(location, color, direction) {
        super('bishop', location, color, direction)
    }

    possibleDestinations(board) {
        return straightLineMoves(this.color, Direction.diagonals, 10, this.location, board)
    }
}

class Rook extends Piece {
    constructor(location, color, direction) {
        super('rook', location, color, direction)
    }

    possibleDestinations(board) {
        return straightLineMoves(this.color, Direction.cardinal, 14, this.location, board)
    }
}

class Queen extends Piece {
    constructor(location, color, direction) {
        super('queen', location, color, direction)
    }

    possibleDestinations(board) {
        return straightLineMoves(this.color, Direction.allEight, 14, this.location, board)
    }
}

class King extends Piece {
    constructor(location, color, direction) {
        super('king', location, color, direction)
    }

    possibleDestinations(board) {
        return straightLineMoves(this.color, Direction.allEight, 1, this.location, board)
    }
}

class Player {
    constructor(color, direction, swapQueen = false) {
        this.color = color
        this.direction = direction
        this.swapQueen = swapQueen
    }

    initPieces(board) {
        const queen = this.swapQueen ? King : Queen;
        const king = this.swapQueen ? Queen : King;


        return _.reduce(_.range(8), (b, i) => b.placePiece(Pawn, this.color, new Point(i + 3, 12), this.direction), board)
            .placePiece(Rook, this.color, new Point(3, 13), this.direction)
            .placePiece(Knight, this.color, new Point(4, 13), this.direction)
            .placePiece(Bishop, this.color, new Point(5, 13), this.direction)
            .placePiece(queen, this.color, new Point(6, 13), this.direction)
            .placePiece(king, this.color, new Point(7, 13), this.direction)
            .placePiece(Bishop, this.color, new Point(8, 13), this.direction)
            .placePiece(Knight, this.color, new Point(9, 13), this.direction)
            .placePiece(Rook, this.color, new Point(10, 13), this.direction)
    }
}

const UNUSABLE = "UNUSABLE";
const EMPTY = "EMPTY";


class Board {
    constructor() {
        this.WIDTH = 14
        this.HEIGHT = 14

        this.board = {}
    }

    copy() {
        let board = new Board();
        board.board = _.clone(this.board);
        return board;
    }

    getTile = (location, direction = Direction.cardinal.UP) => {
        const [index, indexLoc] = this.toIndex(location, direction);
        if (!index) {
            return new Tile(indexLoc, false);
        }
        const value = this.board[index];
        if (!_.isUndefined(value) && !_.isNull(value)) {
            return value;
        } else {
            return new Tile(indexLoc, true);
        }
    }


    setPiece = (piece) => {
        let [index, newLocation] = this.toIndex(piece.location, Direction.cardinal.UP);
        if (!index) {
            throw new RangeError(`Invalid index: ${piece.location}: ${Direction.cardinal.UP.toString()}`)
        } else {
            let clone = new Board();
            clone.board = {
                ...this.board,
                [index]: piece
            }
            return clone;
        }
    }

    movePiece = (source, dest) => {
        const tempLocation = source.location
        source.location = dest.location
        return this.setPiece(source).removePiece(tempLocation)
    }

    placePiece(pieceType, color, localLocation, direction) {
        const [index, globalLocation] = this.toIndex(localLocation, direction);
        const piece = new pieceType(globalLocation, color, direction);
        return this.setPiece(piece);
    }


    removePiece = (location) => {
        let [index, newLocation] = this.toIndex(location, Direction.cardinal.UP);
        if (!index) {
            throw new RangeError(`Invalid index: ${location}: ${Direction.cardinal.UP.toString()}`)
        } else {
            let clone = new Board();
            clone.board = {
                ...this.board,
                [index]: null
            }
            return clone;
        }
    }



    toIndex = (location, direction = Direction.cardinal.UP) => {
        const newLocation = Direction.switch(direction, {
            UP: location,
            RIGHT: new Point(this.HEIGHT - location.y - 1, location.x),
            DOWN: new Point(this.WIDTH - location.x - 1, this.HEIGHT - location.y - 1),
            LEFT: new Point(location.y, this.WIDTH - location.x - 1)
        })

        if (
            (newLocation.x < 0 || newLocation.y < 0 || newLocation.x >= this.WIDTH || newLocation.y >= this.HEIGHT)
            || (newLocation.x < 3 && newLocation.y < 3) || (newLocation.x < 3 && newLocation.y > 10)
            || (newLocation.x > 10 && newLocation.y < 3) || (newLocation.x > 10 && newLocation.y > 10)
        ) {
            return [null, newLocation];
        }

        const index = newLocation.toString();
        return [index, newLocation];
    }

    fromIndex = (location, direction = Direction.cardinal.UP) => {
        const newLocation = Direction.switch(direction, {
            UP: location,
            RIGHT: new Point(location.y, this.WIDTH - 1 - location.x),
            DOWN: new Point(this.WIDTH - location.x - 1, this.HEIGHT - location.y - 1),
            LEFT: new Point(this.HEIGHT - 1 - location.y, location.x)
        })

        return newLocation;

    }
}


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

export class FourPersonChess extends Component {
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