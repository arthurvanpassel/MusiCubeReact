import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';

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
    pictureAlt: "picture"
  }

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
    this.setState({
      tweetTextPic:  ' #' + sessionStorage.getItem('activePlaylistNameHashTag') + ' #' + sessionStorage.getItem('chosenSongHashTag')
    });
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

  postPicOnTwitter = () => {

    //console.log(this.state);
    var content = {
      text: this.state.tweetTextPic,
      picAlt: this.state.pictureAlt
    };
    fetch('/api/postPic',{
      method: 'POST',
      body: JSON.stringify(content),
      json: true,
      headers: new Headers({
        'Content-Type': 'application/json',
      })
    })
    .then(res => res.json())
    .then(data => console.log({data}));

    this.goToEndPage();
  }

  goToEndPage () {
    this.props.history.push({
      pathname: '/thanks'
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
    console.log(this.state);
    return (
      <div className="App">
        <div className="">
          <div className="form">
            <div className="postPhoto">
              <h1>Tweet it!</h1>
              <form onSubmit={this.postPicOnTwitter}>
                <textarea rows="6" cols= "30" onChange={this.handleChangePic} placeholder='Tweet it...'>
                  { ' #' + sessionStorage.getItem('activePlaylistNameHashTag') + ' #' + sessionStorage.getItem('chosenSongHashTag')}
                </textarea><br/>
                <button onClick={() => this.postPicOnTwitter()}>Tweet</button><br/>
                <button onClick={() => this.goToEndPage()}>No thanks</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TrackAdded;
