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
    playlistName: "",
    playlistId: null,
    activePlaylistId: "",
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
    //console.log(value)
    spotifyWebApi.searchTracks(value)
    .then((response) => {
      this.setState({
        tracks: response.tracks.items
      })
    })
  }

  showPLaylists () {
    spotifyWebApi.getMe()
    .then((response) => {
      this.setState({
        userId: response.id
      })
    });

    spotifyWebApi.getUserPlaylists(this.state.userId)
      .then((response) => {
        this.setState({
          playlists: response.items
        })
      })
  }

  handleChange = event => {
    this.setState({playlistName: event.target.value});
    //console.log(this.state.playlistName);
  }

  setActivePLaylist = playlist => {
    this.setState({
      activePlaylistId: playlist.id,
      activePlaylistName: playlist.name
    });
  }

  AddToPlaylist = track => {
    //console.log(track);
    if (!this.state.activePlaylistId) {
      alert("Duid een afspeellijst aan")
    }
    else {
      //console.log(track);
      var tracksInPlaylist = spotifyWebApi.getPlaylistTracks(this.state.activePlaylistId);
      console.log(tracksInPlaylist);

      var uris =  [track.uri];
      spotifyWebApi.addTracksToPlaylist(this.state.activePlaylistId, uris, {'uris': uris, 'position': 0});
      //https://api.spotify.com/v1/playlists/13CsqCUEgPKYRSBWUI8jXw/tracks?uris=spotify%3Atrack%3A4iV5W9uYEdYUVa79Axb7Rh%2Cspotify%3Atrack%3A1301WleyT98MSxVHPZCA6M

      spotifyWebApi.play({'uris': uris});
    }
  }

  CreatePLaylist() {
    spotifyWebApi.createPlaylist({"name":this.state.playlistName, "public":true, "collaborative":false, "description":null})
    .then((response) => {
      this.setState({
        playlistId: response.id
      })
    });
    spotifyWebApi.getMe()
    .then((response) => {
      this.setState({
        userId: response.id
      })
    });
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

          <div className="ChoosePLaylists">
            <button onClick={() => this.showPLaylists()}>Show playlist</button>
            <ul>
            {this.state.playlists.map(playlist => (
              <a id="track" href="#" onClick={() => this.setActivePLaylist(playlist)}><li>{playlist.name}</li></a>
            ))}
            </ul>
            <h4>Active playlist</h4>
            <p>
              {this.state.activePlaylistId? this.state.activePlaylistName : 'No active playlist'}
            </p>
          </div>

          <form>
            <label>Search song</label>
            <input type='text' placeholder='Name track' onChange={this.onChange}></input>
            <div>

              <ul>
              {this.state.tracks.map(track => (
                <a id="track" href="#" onClick={() => this.AddToPlaylist(track)}><li>{track.name} - {track.artists[0].name}</li></a>
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
