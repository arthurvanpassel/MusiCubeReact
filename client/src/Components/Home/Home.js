import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify();

class Home extends Component {
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
    activePlaylistId: null,
    activePlaylistName: "",
    playlists: [],
    allTracks: [],
    goToNextPage: false
  }
  if (params.access_token) {
    spotifyWebApi.setAccessToken(params.access_token);
      sessionStorage.setItem('accesToken', params.access_token );
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
      //console.log(response.tracks.items[0])
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

  AddToPlaylist = track => {
    //console.log(track);
    if (sessionStorage.getItem('activePlaylistId') == null) {
      var userId = this.state.userId;
      this.props.history.push({
        pathname: '/configuration',
        state: {
          userId: userId
         }
      });
    }
    else {
      var trackInPlaylist = false;
      var uris =  [track.uri];
      var countTracks = spotifyWebApi.getPlaylistTracks(sessionStorage.getItem('activePlaylistId'))
      spotifyWebApi.getPlaylistTracks(sessionStorage.getItem('activePlaylistId'))
      .then((response) => {
        this.setState({allTracks: response.items});
        //console.log(this.state.allTracks);
        //console.log(this.state.allTracks.length);

        for (var i = 0; i < response.items.length; i++) {
          //console.log(this.state.allTracks[i].track.id);
          if (track.id === response.items[i].track.id) {
            console.log('track is  in playlist')
            trackInPlaylist = true;
          }
        }
        console.log(trackInPlaylist);
        if (trackInPlaylist == false) {
          spotifyWebApi.addTracksToPlaylist(sessionStorage.getItem('activePlaylistId'), uris, {'uris': uris, 'position': response.items.length});
        }
      });

      //console.log(trackInPlaylist)
      //https://api.spotify.com/v1/playlists/13CsqCUEgPKYRSBWUI8jXw/tracks?uris=spotify%3Atrack%3A4iV5W9uYEdYUVa79Axb7Rh%2Cspotify%3Atrack%3A1301WleyT98MSxVHPZCA6M
      //spotifyWebApi.play({'uris': uris});

      sessionStorage.setItem('chosenSong', track.name );

      var res2 = sessionStorage.getItem('chosenSong');
      res2 = res2.replace(/[^a-zA-Z0-9_]/g, "");
      sessionStorage.setItem('chosenSongHashTag', res2);

      this.props.history.push({
        pathname: '/picture'
      });
    }
  }

  goToConfig () {
    var playList = this.state.activePlaylistId;
    this.showPLaylists();
    var playLists = this.state.playlists;
    var userId = this.state.userId;

    this.props.history.push({
      pathname: '/configuration',
      state: {
        userId: userId
       }
    });
  }

  render() {
    return (
      <div className="App">
        <div className=''>
        {!this.state.loggedIn?
          (
            <div>
            <div className="logo">
            <img src="images/logoFullWhite.png" />
            </div>
            <a href='https://damp-reaches-95671.herokuapp.com/login'><button className="loginButton">Request a song</button></a>
            </div>
          ) : (
            <div>
              <div className="hide">
                <div>Now Playing: {this.state.nowPlaying.name}</div>
                <div><img src={this.state.nowPlaying.image} style={{width: 300}}></img></div>
                <button onClick={() => this.getNowPlaying()}>Check Now Playing...</button>
              </div>
              <button onClick={() => this.goToConfig()}>Choose a playlist</button>
              <div className="logo">
                <img src="images/logoFullRed.png" />
              </div>
              <div className="redBackground">
              <form className="searchSongForm">
                <h1>Which song would you like to request?</h1>
                <input type='text' placeholder='Search...' onChange={this.onChange}></input>
                <div>

                  <ul>
                  {this.state.tracks.map(track => (
                    <a id="track" href="#" onClick={() => this.AddToPlaylist(track)}><li>
                      <div className="flex">
                        <div className="imgTrack">
                          <img src={track.album.images[0].url} />
                        </div>
                        <div className="songInfo">
                          <p>{track.name}</p>
                          <p>{track.artists[0].name}</p>
                        </div>
                        <div className="chooseButton">
                          <button><strong>CHOOSE</strong></button>
                        </div>
                      </div>
                    </li></a>
                  ))}
                  </ul>

                </div>
              </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Home;
