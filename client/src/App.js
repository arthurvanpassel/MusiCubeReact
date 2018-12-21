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
    userId: null,
    playlistName: ""
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

  handleChange = event => {
    this.setState({playlistName: event.target.value});
    console.log(this.state.playlistName);
  }

  AddToPlaylist = track => {
    console.log(spotifyWebApi.getUserPlaylists('1132457862'));
  }

  CreatePLaylist() {
    console.log('createPlaylist');
    spotifyWebApi.createPlaylist({"name":this.state.playlistName, "public":false, "collaborative":true, "description":null});
    //spotifyWebApi.addTracksToPlaylist('13CsqCUEgPKYRSBWUI8jXw', {"uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh","spotify:track:1301WleyT98MSxVHPZCA6M"], "position": 3});
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

          <form onSubmit={this.createPlaylist}>
            <input type="text" value={this.state.playlistName} onChange={this.handleChange} />
            <button onClick={() => this.CreatePLaylist()}>Create playlist</button>
          </form>

          <form>
            <label>Search song</label>
            <input type='text' placeholder='Name track' onChange={this.onChange}></input>
            <div>

              <ul>
              {this.state.tracks.map(track => (
                <button onClick={() => this.AddToPlaylist(track)} ><li>{track.name} - {track.artists[0].name}</li></button>
              ))}
              </ul>

            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
