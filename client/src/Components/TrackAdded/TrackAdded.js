import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';

import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

var base64Img = require('base64-img');
var base64ToImage = require('base64-to-image');

const spotifyWebApi = new Spotify();

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
    playlists: [],
    tweetText: "",
    tweetTextPic: "",
    pictureUrl: "",
    pictureAlt: ""
  }

  this.onToggleLoop = this.onToggleLoop.bind(this);
  
  if (params.access_token) {
    spotifyWebApi.setAccessToken(params.access_token)
  }

    this.handleChange = this.handleChange.bind(this);
    this.handleChangePic = this.handleChangePic.bind(this);
    this.postOnTwitter = this.postOnTwitter.bind(this);
    this.postOnPicTwitter = this.postPicOnTwitter.bind(this);
    this.onChange = this.onChange.bind(this);
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
    this.setState({
      pictureUrl: dataUri
    })
    console.log(this.state);
  }

  getFromTwitter () {
    fetch('/get')       // node-cors-server/app.js
    .then(res => res.json())
    .then(data => console.log({data}))
}

  postOnTwitter () {
    var content = {
      text: this.state.tweetText
    };
    fetch('/post',{
      method: 'POST',
      body: JSON.stringify(content),
      json: true,
      headers: new Headers({
        'Content-Type': 'application/json',
      })
    })
    .then(res => res.json());
  }

  postPicOnTwitter () {
    //console.log(this.state);
    var content = {
      text: this.state.tweetTextPic,
      picUrl: this.state.pictureUrl,
      picAlt: this.state.pictureAlt
    };
    fetch('/postPic',{
      method: 'POST',
      body: JSON.stringify(content),
      json: true,
      headers: new Headers({
        'Content-Type': 'application/json',
      })
    })
    // .then(res => res.json());
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
        <h1>Uw liedje is succesvol toegevoegd aan de afspeellijst</h1>
        <h2>Huidige afspeellijst</h2>
        //<p>{this.state.activePlaylistId}</p>
        //<p>{this.state.activePlaylistName}</p>

        <button onClick={() => this.getFromTwitter()}>Get some tweets</button>

        <form onSubmit={this.postOnTwitter}>
          <textarea rows="6" cols= "30" onChange={this.handleChange}></textarea>
          <button onClick={() => this.postOnTwitter()}>Tweet Something</button>
        </form>

        <Camera
          onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } }
          imageType = {IMAGE_TYPES.JPG}
        />

        <input type='text' placeholder='Describe your pic' onChange={this.onChange}></input>
        <form onSubmit={this.postPicOnTwitter}>
          <textarea rows="6" cols= "30" onChange={this.handleChangePic}>Put your tweet here!</textarea>
          <button onClick={() => this.postPicOnTwitter()}>Tweet your pic!</button>
        </form>

      </div>
    );
  }
}

export default TrackAdded;
