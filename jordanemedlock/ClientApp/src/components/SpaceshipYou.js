import React, { Component, useState, useEffect } from 'react';


const toRad = (deg) => {
    return Math.PI / 180 * deg;
}

const Arrow = (props) => {
    const cx = props.cx;
    const cy = props.cy;
    const ir = props.ir;
    const or = props.or;
    const st = toRad(props.st); // start theta
    const et = toRad(props.et); // end theta
    const at = toRad(props.et - 20); // arrow theta
    const hw = 15;
    const color = props.color;
    let d = `M ${ir * Math.cos(st) + cx} ${ir * Math.sin(st) + cy}\n`;
    d += `A ${ir} ${ir} 0 0 0 ${ir * Math.cos(et) + cx} ${ir * Math.sin(et) + cy}\n`;
    d += `L ${(ir - hw) * Math.cos(et) + cx} ${(ir - hw) * Math.sin(et) + cy}\n`;
    d += `L ${(ir + or) / 2 * Math.cos(at) + cx} ${(ir + or) / 2 * Math.sin(at) + cy}\n`;
    d += `L ${(or + hw) * Math.cos(et) + cx} ${(or + hw) * Math.sin(et) + cy}\n`;
    d += `L ${or * Math.cos(et) + cx} ${or * Math.sin(et) + cy}\n`;
    d += `A ${or} ${or} 0 0 1 ${or * Math.cos(st) + cx} ${or * Math.sin(st) + cy}\n`;
    d += `L ${ir * Math.cos(st) + cx} ${ir * Math.sin(st) + cy}\n`;
    return (
        <g>
            <path d={d} style={{ strokeWidth: '2px', stroke: 'black', fill: color }} />
        </g>
    );
}

const Meter = (props) => {
    const cx = props.cx;
    const cy = props.cy;
    const ir = props.ir;
    const or = props.or;
    const st = toRad(props.st); // start theta
    const et = toRad(props.et); // end theta
    const id = props.id;
    const color = props.color;

    const meterD = (frac) => {
        const newEnd = st + (et - st) * frac;
        let d = `M ${ir * Math.cos(st) + cx} ${ir * Math.sin(st) + cy}\n`;
        d += `A ${ir} ${ir} 0 0 0 ${ir * Math.cos(newEnd) + cx} ${ir * Math.sin(newEnd) + cy}\n`;
        d += `L ${or * Math.cos(newEnd) + cx} ${or * Math.sin(newEnd) + cy}\n`;
        d += `A ${or} ${or} 0 0 1 ${or * Math.cos(st) + cx} ${or * Math.sin(st) + cy}\n`;
        d += `L ${ir * Math.cos(st) + cx} ${ir * Math.sin(st) + cy}\n`;
        return d;
    } 
    return (
        <g>
            <filter id={`${id}-shadow`} x='-50%' y='-50%' width='200%' height='200%'>
                <feOffset result="offOut" in="SourceGraphic" dx='0' dy='0' />
                <feGaussianBlur result="blurOut" in="offOut" stdDeviation='5' />
                <feBlend in="blurOut" int2="SourceGraphic" mode="normal" />
            </filter>
            <path d={meterD(1.0)} style={{ fill: 'black', strokeWidth: '2px', stroke: 'black' }} />
            <path d={meterD(props.frac)} style={{ fill: color }} filter={`url(#${id}-shadow`} />
            <path d={meterD(1.0)} style={{ fill: 'rgba(0,0,0,0)', strokeWidth: '2px', stroke: 'black' }} />
        </g>
    );
}

const Core = (props) => {

    const cx = props.width / 2.0;
    const cy = props.height / 2.0;
    const r = props.width / 2.0;
    const mentalFrac = 0.5;
    const physicalFrac = 0.25;

    return (
        <g>
            <Meter cx={cx} cy={cy} ir={r * 0.47} or={r * 0.60} st={30} et={-30} color='cyan' frac={mentalFrac} />
            <Meter cx={cx} cy={cy} ir={r * 0.47} or={r * 0.60} st={210} et={150} color='orange' frac={physicalFrac} />

            <circle cx={cx} cy={cy} r={r * 0.5} style={{ stroke: 'black', strokeWidth: '10px', fill: 'rgba(0, 0, 0, 0)' }} />
            <Arrow cx={cx} cy={cy} ir={r * 0.25} or={r * 0.35} st={37} et={37-60} color='cyan' />
            <Arrow cx={cx} cy={cy} ir={r * 0.25} or={r * 0.35} st={217} et={217-60} color='orange' />
        </g>
    );
}

const Spinner = (props) => {
    return (
        <g>
            <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from={`360 ${props.cx} ${props.cy}`}
                to={`
0 ${props.cx} ${props.cy}`}
                dur="10s"
                repeatCount="indefinite"
            />
            {props.children}
        </g>
    );
}

const useStateWithLocalStorage = (localStorageKey, defaultValue) => {
    const [value, setValue] = useState(
        JSON.parse(localStorage.getItem(localStorageKey)) || defaultValue
    );

    useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(value));
    }, [value]);

    return [value, setValue];
}

export const SpaceshipYou = (props) => {

    const width = 500;
    const height = 500;

    const [rot, setRot] = useState(-45);
    const [velocity, setVelocity] = useStateWithLocalStorage('velocity', -0.25); // degrees per second
    const [timeSet, setTimeSet] = useStateWithLocalStorage('timeSet', Date.now());
    const [physicalFrac, setPhysicalFrac] = useStateWithLocalStorage('physicalFrac', 1.0);



    return (
        <div className="spaceship-you">
            <svg width={width} height={height}>
                <Spinner rot={rot} cx={width / 2} cy={height / 2}>
                    <Core width={width} height={height} />
                </Spinner>
            </svg>
        </div>
    );
};