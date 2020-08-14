import React, { Component } from 'react';

export class Home extends Component {
    static displayName = Home.name;

    render() {
        return (
            <div style={{ marginTop: '33px' }}>
                <h1>Hello, world!</h1>
                <p>Welcome to my site!</p>
                <p>I am a full stack software engineer living in the Seattle area.</p>
                <p>I created this site to hold some of my personal projects and be a location where I can advertise myself and my skills</p>
            </div>
        );
    }
}
