import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './Components/Home/Home';
import TrackAdded from './Components/TrackAdded/TrackAdded';
import Configuration from './Components/Configuration/Configuration';


class App extends Component {
  render() {

    return (
      <div>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/trackAdded' component={TrackAdded} />
          <Route exact path='/configuration' component={Configuration} />
        </Switch>
      </div>
    );
  }
}

export default App;
