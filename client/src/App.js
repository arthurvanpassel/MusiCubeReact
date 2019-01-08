import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './Components/Home/Home';
import Configuration from './Components/Configuration/Configuration';
import Camera from './Components/Camera/Camera';
import TrackAdded from './Components/TrackAdded/TrackAdded';


class App extends Component {
  render() {

    return (
      <div>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/configuration' component={Configuration} />
          <Route exact path='/camera' component={Camera} />
          <Route exact path='/trackAdded' component={TrackAdded} />

        </Switch>
      </div>
    );
  }
}

export default App;
