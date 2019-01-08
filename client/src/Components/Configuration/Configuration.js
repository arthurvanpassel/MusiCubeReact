import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify();

class Configuration extends Component {
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
    //-----------GET-ACTIVE-PLAYLISTNAME----------------------------------------
    spotifyWebApi.getPlaylist(this.state.activePlaylistId)
    .then((response) => {
      this.setState({
        activePlaylistName: response.name
      })
    });
    //-----------GET-PLAYLISTS--------------------------------------------------
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
//---------END------------------------------------------------------------------
  getNowPlaying() {
    spotifyWebApi.getMyCurrentPlaybackState()
    .then((response) => {
      if (response.item == undefined) {
        alert("you're not listening to something");
      }
      else {
        this.setState({
          nowPlaying: {
            name: response.item.name,
            image: response.item.album.images[0].url
          }
        })
      }
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

  goToHome () {

    this.props.history.push({
      pathname: '/'
    });
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

  handleChangePLaylistCreate = event => {
    this.setState({playlistName: event.target.value});
    //console.log(this.state.playlistName);
  }

  setActivePLaylist = playlist => {
    sessionStorage.setItem('activePlaylistId', playlist.id )
    this.goToHome();
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
          <div className=''>
            <div>
              <div className="hide">
                <div>Now Playing: {this.state.nowPlaying.name}</div>
                <div><img src={this.state.nowPlaying.image} style={{width: 300}}></img></div>
                <button onClick={() => this.getNowPlaying()}>Check Now Playing...</button>
              </div>

              <button onClick={() => this.goToHome()}>Back to home</button>
              <div className="logo">
                <img src="images/logoFullRed.png" />
              </div>
              <div className="redBackground">
                <form className="createPlaylistForm" onSubmit={this.createPlaylist}>
                  <h1>Create a playlist</h1>
                  <input type="text" placeholder="playlist name..." value={this.state.playlistName} onChange={this.handleChangePLaylistCreate} /><br/>
                  <button onClick={() => this.CreatePLaylist()}>Create playlist</button>
                </form>

                <div className="ChoosePLaylists">
                <h1>Or choose one</h1>
                  <ul>
                  {this.state.playlists.map(playlist => (
                    <a id="track" href="#" onClick={() => this.setActivePLaylist(playlist)}><li>
                      <div className="flex">
                        <p>{playlist.name}</p>
                        <div className="chooseButton">
                          <button onClick={() => this.setActivePLaylist(playlist)}>Choose</button>
                        </div>
                      </div>
                    </li></a>
                  ))}
                  </ul>
                </div>
              </div>
            </div>
        </div>
      </div>
    );
  }
}

export default Configuration;
