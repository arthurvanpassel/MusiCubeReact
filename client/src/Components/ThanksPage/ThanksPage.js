import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';

var base64Img = require('base64-img');
var base64ToImage = require('base64-to-image');

const spotifyWebApi = new Spotify();

class ThanksPage extends Component {
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
    playlists: [],
    tweetText: "",
    tweetTextPic: "",
    pictureUrl: "",
    pictureAlt: ""
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
  var that = this;
  setTimeout(function() {
    that.props.history.push('/');
  }, 2000);
}

  render() {
    return (
      <div className="App">
        <div className="endPage">
          <h1>Thank you!</h1>
          <p>your song will be played soon</p>
        </div>
      </div>
    );
  }
}

export default ThanksPage;
