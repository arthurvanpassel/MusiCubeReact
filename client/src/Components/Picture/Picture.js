import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';

import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

var base64Img = require('base64-img');
var base64ToImage = require('base64-to-image');

const spotifyWebApi = new Spotify();

class Picture extends Component {
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

  this.onTakePhoto = this.onTakePhoto.bind(this);
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


onTakePhoto (dataUri) {
    // Do stuff with the dataUri photo...
    //console.log(dataUri);
    this.setState({
      pictureUrl: dataUri
    })

    var content = {
      picUrl: dataUri
    };

    fetch('/savePic',{
      method: 'POST',
      body: JSON.stringify(content),
      json: true,
      headers: new Headers({
        'Content-Type': 'application/json',
      })
    })
    .then(res => res.json());

    this.props.history.push({
      pathname: '/trackAdded'
    });
  }

  handleChange = event => {
    this.setState({tweetText: event.target.value});
  }

  handleChangePic = event => {
    this.setState({tweetTextPic: event.target.value});
  }

  onChange = e => {
    const {value} = e.target;
    //console.log(value)
    this.setState({
        pictureAlt: value
    })
  }

  render() {
    return (
      <div className="App">
        <div className="Camera">
          <Camera
            onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } }
            imageType = {IMAGE_TYPES.JPG}
          />
        </div>
      </div>
    );
  }
}

export default Picture;
