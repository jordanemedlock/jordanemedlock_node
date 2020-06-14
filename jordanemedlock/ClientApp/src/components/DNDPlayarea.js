import React, { Component, useState } from 'react';
import _ from 'underscore';
import './DNDPlayarea.css';


const Movable = (props) => {
    const [dragging, setDragging] = useState(false);
    const [coords, setCoords] = useState({ x: props.x, y: props.y });
    const [origin, setOrigin] = useState({ x: 0, y: 0 });

    const x = coords.x;
    const y = coords.y;

    const className = `movable ${dragging ? "dragging" : "still"}`;

    const transform = `translate(${x}, ${y})`

    const onMouseDown = (e) => {
        setOrigin({
            x: e.clientX - x,
            y: e.clientY - y,
        });
        setDragging(true);
    }

    const onMouseMove = (e) => {
        if (dragging) {
            setCoords({
                x: e.clientX - origin.x,
                y: e.clientY - origin.y,
            })
        }
    }

    const onMouseUp = (e) => {
        setDragging(false);
    }

    return (
        <g
            id={props.id}
            className={className}
            transform={transform}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
        >
            {props.children}
        </g>
    )
}

const ColorSquare = (props) => {
    return (
        <rect
            x={props.x}
            y={props.y}
            width={props.width}
            height={props.height}
            onClick={props.onClick}
            style={{
                fill: props.color,
                stroke: props.selected ? 'black' : 'none',
                strokeWidth: props.selected ? 1 : 0
            }}
        />
    )
}

const ColorPalette = (props) => {
    const transform = `translate(${props.x}, ${props.y})`;
    const squareWidth = 30;


    return (
        <g id="color-palette" transform={transform}>
            <ColorSquare
                x={0}
                y={0}
                width={squareWidth}
                height={squareWidth}
                color="red"
                selected={props.color === 'red'}
                onClick={() => props.colorPressed('red')}
            />
            <ColorSquare
                x={0}
                y={squareWidth+1}
                width={squareWidth}
                height={squareWidth}
                color="orange"
                selected={props.color === 'orange'}
                onClick={() => props.colorPressed('orange')}
            />

            <ColorSquare
                x={squareWidth + 1}
                y={0}
                width={squareWidth}
                height={squareWidth}
                color="yellow"
                selected={props.color === 'yellow'}
                onClick={() => props.colorPressed('yellow')}
            />
            <ColorSquare
                x={squareWidth + 1}
                y={squareWidth + 1}
                width={squareWidth}
                height={squareWidth}
                color="green"
                selected={props.color === 'green'}
                onClick={() => props.colorPressed('green')}
            />

            <ColorSquare
                x={(squareWidth + 1) * 2}
                y={0}
                width={squareWidth}
                height={squareWidth}
                color="blue"
                selected={props.color === 'blue'}
                onClick={() => props.colorPressed('blue')}
            />
            <ColorSquare
                x={(squareWidth + 1) * 2}
                y={(squareWidth + 1)}
                width={squareWidth}
                height={squareWidth}
                color="purple"
                selected={props.color === 'purple'}
                onClick={() => props.colorPressed('purple')}
            />

            <ColorSquare
                x={(squareWidth + 1) * 3}
                y={0}
                width={squareWidth}
                height={squareWidth}
                color="#020202"
                selected={props.color === 'black'}
                onClick={() => props.colorPressed('black')}
            />
            <ColorSquare
                x={(squareWidth + 1) * 3}
                y={(squareWidth + 1)}
                width={squareWidth}
                height={squareWidth}
                color="#FAFAFA"
                selected={props.color === 'white'}
                onClick={() => props.colorPressed('white')}
            />
        </g>
    );
}

//const CharacterClass = (props) => {

//    const onMouseDown = (id, coords) => {

//    }

//    const onMouseMove = (id, coords) => {

//    }

//    const onMouseUp = (id, coords) => {
//        const dx = Math.abs(coords.x - props.x);
//        const dy = Math.abs(coords.y - props.y);

//        const inBox = dx < 50 && dy < 50;
//        const isInit = id === initialId;

//        if (isInit && inBox) {
//            // resets the fucker (the component will no longer exist)
//            setInitialCharacter(mkInitialCharacter(id));
//        } else if (isInit && !inBox) {
//            // create a new character at init.
//            const init = initialCharacter; // I think this is unnessary, but I just want to be sure
//            setInitialCharacter(mkInitialCharacter(id + 1));
//            setInitialId(id + 1);

//            // and add init to additional
//            setAdditionalCharacters((state) => ({ ...state, [id]: init }));
//        } else if (!isInit && inBox) {
//            // destroy this character
//            setAdditionalCharacters((state) => _.omit(state, id))
//        } else if (!isInit && !inBox) {
//            // dont worry about it. they are just moving it normally
//        }
//    }

//    const mkInitialCharacter = (id) => (
//        <Movable
//            x={props.x}
//            y={props.y}
//            onMouseDown={(coords) => onMouseDown(id, coords)}
//            onMouseMove={(coords) => onMouseMove(id, coords)}
//            onMouseUp={(coords) => onMouseUp(id, coords)}
//        >
//            {props.children}
//        </Movable>
//    );

//    const [initialCharacter, setInitialCharacter] = useState(mkInitialCharacter(0));
//    const [initialId, setInitialId] = useState(0);
//    const [additionalCharacters, setAdditionalCharacters] = useState({});
//    return (
//        <g>
//            {initialCharacter}
//            {_.values(additionalCharacters)}
//        </g>
        
//    );
//}

//const Square = (props) => {
//    return (
//        <rect
//            x={props.x}
//            y={props.y}
//            width={50}
//            height={50}
//            style={{ fill: props.color, stroke: 'gray' }}
//            onMouseDown={props.onMouseDown}
//            onMouseUp={props.onMouseUp}
//            onMouseMove={props.onMouseMove}
//        />
//    )
//}

const Triangle = (props) => {

    const rthot = Math.sqrt(3) / 2;

    const cx = props.cx;
    const cy = props.cy;
    const r = props.r;

    const points = `${cx},${-r + cy} ${rthot * r + cx},${0.5 * r + cy} ${-rthot * r + cx},${0.5 * r + cy}`;

    return (
        <polygon
            points={points}
            onMouseUp={props.onMouseUp}
            style={props.style}
        />
    )
}

const RegularPolygon = (props) => {
    const cx = props.cx;
    const cy = props.cy;
    const r = props.r;
    const n = props.n;
    const t = 2 * Math.PI;
    const dth = t / n;
    const th = -Math.PI / 2;

    const points = _.range(n).map((i) => `${r * Math.cos(i * dth + th) + cx},${r * Math.sin(i * dth + th) + cy}`).join(' ');

    return (
        <polygon
            points={points}
            onMouseUp={props.onMouseUp}
            style={props.style}
        />
    )
}


const RegularStar = (props) => {
    const cx = props.cx;
    const cy = props.cy;
    const r1 = props.r1;
    const r2 = props.r2;
    const n = props.n;
    const t = 2 * Math.PI;
    const dth = t / n;
    const th = -Math.PI / 2;

    const points = _.range(n * 2).map((i) => (
            i % 2 == 0 ?
            `${r1 * Math.cos(i * dth + th) + cx},${r1 * Math.sin(i * dth + th) + cy}` :
            `${r2 * Math.cos(i * dth + th) + cx},${r2 * Math.sin(i * dth + th) + cy}`
    )).join(' ');

    return (
        <polygon
            points={points}
            onMouseUp={props.onMouseUp}
            style={props.style}
        />
    )
}


const CharactersController = (props) => {
    const [color, setColor] = useState('red');

    const [characters, setCharacters] = useState([]);

    const characterHeight = 50;
    const margin = 10;
    const characterPickerHeight = characterHeight + margin * 2;

    const addCharacter = (char) => {
        setCharacters((chars) => [
            ...chars,
            char
        ])
    }


    return (
        <g>
            {characters.map((character, index) => character)}

            <ColorPalette
                x={5}
                y={props.boardHeight - 65}
                colorPressed={setColor}
                color={color}
            />
            <rect
                x={150}
                y={props.boardHeight - characterHeight - margin}
                width={characterHeight}
                height={characterHeight}
                style={{
                    fill: color,
                    stroke: 'gray'
                }}
                onMouseUp={(e) => {
                    addCharacter(
                        <Movable x={10} y={10}>
                            <rect
                                x={0}
                                y={0}
                                width={characterHeight}
                                height={characterHeight}
                                style={{
                                    fill: color,
                                    stroke: 'gray'
                                }}
                            />
                        </Movable>
                    )
                }}
            />
            <RegularPolygon
                cx={250}
                cy={props.boardHeight - 0.333 * characterHeight - margin}
                r={0.666 * characterHeight}
                n={3}
                style={{
                    fill: color,
                    stroke: 'gray'
                }}
                onMouseUp={(e) => {
                    addCharacter(
                        <Movable x={35} y={35}>
                            <RegularPolygon
                                cx={0}
                                cy={0}
                                n={3}
                                r={0.666 * characterHeight}
                                style={{
                                    fill: color,
                                    stroke: 'gray'
                                }}
                            />
                        </Movable>
                    )
                }}
            />
            <circle
                cx={325}
                cy={props.boardHeight - characterHeight / 2 - margin}
                r={characterHeight / 2}
                style={{
                    fill: color,
                    stroke: 'gray'
                }}
                onMouseUp={(e) => {
                    addCharacter(
                        <Movable x={35} y={35}>
                            <circle
                                cx={0}
                                cy={0}
                                r={characterHeight / 2}
                                style={{
                                    fill: color,
                                    stroke: 'gray'
                                }}
                            />
                        </Movable>
                    )
                }}
            />
            <RegularStar
                cx={400}
                cy={props.boardHeight - 0.5 * characterHeight - margin}
                r1={0.2 * characterHeight}
                r2={0.6 * characterHeight}
                n={5}
                style={{
                    fill: color,
                    stroke: 'gray'
                }}
                onMouseUp={(e) => {
                    addCharacter(
                        <Movable x={35} y={35}>
                            <RegularStar
                                cx={0}
                                cy={0}
                                n={5}
                                r1={0.2 * characterHeight}
                                r2={0.6 * characterHeight}
                                style={{
                                    fill: color,
                                    stroke: 'gray'
                                }}
                            />
                        </Movable>
                    )
                }}
            />
        </g>
    )
}

const Grid = (props) => {
    const numCols = props.width / props.gridWidth;
    const numRows = props.height / props.gridHeight;
    return (
        <>
            <g className="v-grid">
                {_.range(0, numCols).map((xi) => {
                    const x1 = props.gridWidth * xi;
                    const x2 = props.gridWidth * xi;
                    const y1 = 0;
                    const y2 = props.height;
                    return (
                        <line key={xi} className="v-grid-line" x1={x1} x2={x2} y1={y1} y2={y2} />
                    );
                })}
            </g>
            <g className="h-grid">
                {_.range(0, numRows).map((yi) => {
                    const x1 = 0;
                    const x2 = props.width;
                    const y1 = props.gridHeight * yi;
                    const y2 = props.gridHeight * yi;
                    return (
                        <line key={y1} className="h-grid-line" x1={x1} x2={x2} y1={y1} y2={y2} />
                    );
                })}
            </g>
        </>
    );
}

export const DNDPlayarea = (props) => {
    const [width, setWidth] = useState(1000);
    const [height, setHeight] = useState(800);
    const [color, setColor] = useState('red');


    //const updateDimensions = () => {
    //    const container = document.getElementById('dnd-playarea-container');
    //    setWidth(Math.max(500, container.innerWidth - 50));
    //    setHeight(Math.max(500, window.innerHeight - 100));
    //}

    const onColorChanged = (c) => {
        console.log(c);
        setColor(c);
    }

    //window.addEventListener("resize", updateDimensions);

    return (
        <div id="dnd-playarea-container">
            <svg width={width} height={height} style={{ backgroundColor: "white" }}>
                <Grid
                    width={width}
                    height={height}
                    gridWidth={100}
                    gridHeight={100}
                />
                <CharactersController
                    boardHeight={height}
                    boardWidth={width}
                />
            </svg>
        </div>
    );
}
