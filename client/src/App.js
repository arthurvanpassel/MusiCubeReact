import React, { Component } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify();

class App extends Component {
constructor() {
  super();
  const params = this.getHashParams();
  this.state = {
    loggedIn: params.access_token? true : false,
    nowPlaying: {
      name: 'Not Checked',
      image: ''
    },
    query: "",
    tracks: [],
    userId: null
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

  getNowPlaying() {
    spotifyWebApi.getMyCurrentPlaybackState()
    .then((response) => {
      this.setState({
        nowPlaying: {
          name: response.item.name,
          image: response.item.album.images[0].url
        }
      })
    })
  }

  onChange = e => {
    const {value} = e.target;
    console.log(value)
    spotifyWebApi.searchTracks(value)
    .then((response) => {
      this.setState({
        tracks: response.tracks.items
      })
    })
  }

  AddToPlaylist = track => {
    //console.log(spotifyWebApi.getUserPlaylists());
    const uris = ["spotify:track:6l7PqWKsgm4NLomOE7Veou"];

    spotifyWebApi.addTracksToPlaylist("1132457862","13CsqCUEgPKYRSBWUI8jXw", uris);
  }

  CreatePLaylist () {
    console.log(spotifyWebApi.getMe());

    spotifyWebApi.getMe()
    .then((response) => {
      this.setState({
        userId: response.id,
      })
    })
    console.log(this.state.userId);
    //spotifyWebApi.createPlaylist(this.state.userId);


  }

  render() {
    return (
      <div className="App">
        <div className='App-header'>
          <a href='http://localhost:8888/login'><button style={{ margin: 15}}>Login with Spotify</button></a>

          <div>Now Playing: {this.state.nowPlaying.name}</div>
          <div>
            <img src={this.state.nowPlaying.image} style={{width: 300}}></img>
          </div>
          <button onClick={() => this.getNowPlaying()}>Check Now Playing...</button>

          <form>
            <label>Search song</label>
            <input type='text' placeholder='Name track' onChange={this.onChange}></input>
            <div>

              <ul>
              {this.state.tracks.map(track => (
                <button onClick={() => this.AddToPlaylist(track)} ><li>{track.name} - {track.artists[0].name}</li></button>
              ))}
              </ul>

              <button onClick={() => this.CreatePLaylist()}>Create playlist</button>

            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
