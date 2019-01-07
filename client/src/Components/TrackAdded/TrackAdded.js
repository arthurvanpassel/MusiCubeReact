import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify();
var instagram = require('instagram').createClient('0131ef91227c4ebeab36d1d128de2f35', '85ff23655d984d03a4ed68427afc80f6')

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

shareOnfInstagram () {
  instagram.tags.tag('snow', {access_token: "10160123960.0131ef9.eec0370363514f4f9c73923e6cb04c3c"}, function (tag, error) { console.log(tag); });
}


  render() {
    return (
      <div className="App">
        <h1>Uw liedje is succesvol toegevoegd aan de afspeellijst</h1>
        <h2>Huidige afspeellijst</h2>
        //<p>{this.state.activePlaylistId}</p>
        //<p>{this.state.activePlaylistName}</p>
        <button onClick={() => this.shareOnfInstagram()}>share on Instagram</button>
      </div>
    );
  }
}

export default TrackAdded;
