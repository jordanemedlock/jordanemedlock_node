import React, { Component } from 'react';
//import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        return (
            <div id="sidebar">
                <div className="sidebar-header">
                    <h3>jordanemedlock</h3>
                </div>
                <ul className="list-unstyled components">
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href="/jeopardy">Jeopardy</a>
                    </li>
                    <li>
                        <a href="/dnd-playarea">DND Playarea</a>
                    </li>
                    <li>
                        <a href="/spaceship-you">Spaceship You</a>
                    </li>
                    <li>
                        <a href="/four-person-chess">Four Person Chess</a>
                    </li>
                </ul>
            </div>
        );
    }
}
