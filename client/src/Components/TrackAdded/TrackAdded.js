import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify();
var Twit = require('twit');

var T = new Twit({
  consumer_key:         'RUvKdeluIFWKbCksmZyPd2ofL',
  consumer_secret:      '9lJ4X3u7qPQjRmeMQnvBtd2j9b2qeFzNZppF5UuD5CDTBxKxzo',
  access_token:         '1077614313081372673-fX3RjPjRMg7GSNC5YYO6Mk9xwDPRG8',
  access_token_secret:  'NBFeLOiImmQXHczcPi9B6uo7FNwFCXPUrIr54u9zInJea'
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

tweetSong () {

  T.get('search/tweets', {q:'nieuwe', count:2}, function (err, data, response) {
    console.log(err);
    console.log(data);
  });
}


  render() {
    return (
      <div className="App">
        <h1>Uw liedje is succesvol toegevoegd aan de afspeellijst</h1>
        <h2>Huidige afspeellijst</h2>
        //<p>{this.state.activePlaylistId}</p>
        //<p>{this.state.activePlaylistName}</p>
        <button onClick={() => this.tweetSong()}>Tweet your song</button>
      </div>
    );
  }
}

export default TrackAdded;
