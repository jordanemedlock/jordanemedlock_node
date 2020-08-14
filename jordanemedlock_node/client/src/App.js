import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Jeopardy } from './components/Jeopardy';
import { DNDPlayarea } from './components/DNDPlayarea';
import { SpaceshipYou } from './components/SpaceshipYou';
import { FourPersonChess } from './components/FourPersonChess';
// import { Game } from './common/models';


import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
            <Route exact path='/' component={Home} />
            <Route path='/jeopardy' component={Jeopardy} />
            <Route path='/dnd-playarea' component={DNDPlayarea} />
            <Route path='/spaceship-you' component={SpaceshipYou} />
            <Route path='/four-person-chess' component={FourPersonChess} />
      </Layout>
    );
  }
}
