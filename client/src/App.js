import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import Home from './Components/Home/Home';
import TrackAdded from './Components/TrackAdded/TrackAdded';


class App extends Component {
  render() {
    return (
      <div>
        <Route exact path='/' component={Home} />
        <Route exact path='/TrackAdded' component={TrackAdded} />
      </div>
    );
  }
}

export default App;
