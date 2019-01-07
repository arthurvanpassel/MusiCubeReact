import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';

import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

const spotifyWebApi = new Spotify();


var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: 'RUvKdeluIFWKbCksmZyPd2ofL',
  consumer_secret: '9lJ4X3u7qPQjRmeMQnvBtd2j9b2qeFzNZppF5UuD5CDTBxKxzo',
  access_token_key: '1077614313081372673-fX3RjPjRMg7GSNC5YYO6Mk9xwDPRG8',
  access_token_secret: 'NBFeLOiImmQXHczcPi9B6uo7FNwFCXPUrIr54u9zInJea'
});

class TrackAdded extends Component {
constructor(props) {
  super(props);

  const params = this.getHashParams();
  this.state = {
    loggedIn: params.access_token? true : false,
    nowPlaying: {
      name: 'Not Checked',
      image: ''
    },
    query: "",
    tracks: [],
    userId: null,
    playlistName: "",
    playlistId: null,
    //activePlaylistId: this.props.location.state.playlistId,
    activePlaylistName: "",
    playlists: []
  }
  if (params.access_token) {
    spotifyWebApi.setAccessToken(params.access_token)
  }
}

getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

componentDidMount() {
  spotifyWebApi.getPlaylist(this.state.activePlaylistId)
  .then((response) => {
    this.setState({
      activePlaylistName: response.name
    })
  });
}


onTakePhoto (dataUri) {
    // Do stuff with the dataUri photo...
    console.log(dataUri);


  }

  getFromTwitter () {
    fetch('/get')       // node-cors-server/app.js
    .then(res => res.json())
    .then(data => console.log({data}))
}

  postOnTwitter () {
    fetch('/post',{method: 'POST'})       // node-cors-server/app.js
    // .then(res => res.json())
    // .then(data => console.log({data}))
  }

  render() {
    return (
      <div className="App">
        <h1>Uw liedje is succesvol toegevoegd aan de afspeellijst</h1>
        <h2>Huidige afspeellijst</h2>
        //<p>{this.state.activePlaylistId}</p>
        //<p>{this.state.activePlaylistName}</p>
        {/* <Camera
          onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } }
        /> */}
        <button onClick={() => this.getFromTwitter()}>Get some tweets</button>
        <button onClick={() => this.postOnTwitter()}>Tweet Something</button>
      </div>
    );
  }
}

export default TrackAdded;
