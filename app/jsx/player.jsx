/** @jsx React.DOM */
var request = require('request');

var MixPlayer = React.createClass({
  getInitialState: function() {
    return {mixes: {}, playing: {}, sound: null, currentMix: null};
  },
  stateChange: function (state) {
    if (state == "playing") {
      this.state.sound.pause();
    } else {
      this.state.sound.resume();
    }
  },
  fetch: function (url) {
    var that = this;
    Scraper.fetchMix(url, function (err, mix) {

      // Add mix to mixes
      var mixes = that.state.mixes;
      mixes[mix.title] = mix;

      that.setState({mixes: mixes});
      //that.playSong(mix);
    });
  },
  addSong: function () {

  },
  playSong: function (mix) {
    console.log(mix);

    var that = this;

    this.setState({currentMix: mix});

    this.findSoundCloud(mix, function (err, url) {


      var sound = soundManager.createSound({
        id: mix.title,
        url: url,
        whileplaying: function () {
          that.setState({
            playing: {
              duration: this.durationEstimate,
              position: this.position
            }
          });
        },
        onplay: function () {
          that.setState({
            state: 'playing'
          });
        },
        onpause: function () {
          that.setState({
            state: 'paused'
          });
        },
        onresume: function () {
          that.setState({
            state: 'playing'
          });
        }
      });

      soundManager.stopAll();
      sound.play();

      that.setState({
        sound: sound
      });
    });
  },
  findSoundCloud: function (mix, callback) {
    console.log("findSoundcloud", mix);
    mix.media.forEach(function (source) {
      if (source.url.match(/soundcloud.com/) !== null) {

        var resolveUrl = "http://api.soundcloud.com/resolve.json?url=" + source.url + "&client_id=ccf4b730db624e5d43a9f8f69491b157";
        request(resolveUrl, function (error, response, body) {
          var soundCloud = JSON.parse(body);
          console.log("url", soundCloud, soundCloud.stream_url);
          callback(null, soundCloud.stream_url+"?client_id=ccf4b730db624e5d43a9f8f69491b157");
        });
      }
    });
  },
  render: function () {
    return (
      <div>
        <div className="playerWindow left">
          <div>
            <Info mix={this.state.currentMix} />
            <Progress sound={this.state.playing}/>
            <Controls state={this.state.state} onStateChange={this.stateChange}/>
          </div>
          <MixUrlForm onFetch={this.fetch} />
          <Playlist mixes={this.state.mixes} onDoubleClick={this.playSong} />
        </div>
        <div className="discoverWindow left">
          <Discover onAddSong={this.addSong} onPlaySong={this.playSong} />
        </div>
        <div class="clear"></div>
      </div>
    );
  }
});

var Controls = React.createClass({
  play: function (event) {
    var newState = this.props.state == "playing" ? "playing" : "paused";

    this.props.onStateChange(newState);
  },
  stateImage: function () {
    if (this.props.state == 'playing') {
      return "/build/app/public/svg/pause.svg"
    } else {
      return "/build/app/public/svg/play.svg"
    }
  },
  render: function () {
    return (
      <div className="controls">
        <img className="icon" src="/build/app/public/svg/previous.svg" />
        <img onClick={this.play} className="icon" src={this.stateImage()} />
        <img className="icon" src="/build/app/public/svg/next.svg" />
        <Volume />
        <div className="clear"></div>
      </div>
    );
  }
});

var Volume = React.createClass({
  render: function () {
    return (
      <div className="volume right">
        <img className="icon" src="/build/app/public/svg/volume-off.svg" />
      </div>
    )
  }
});

var Progress = React.createClass({
  toTime: function (position) {
    return Format(Math.round(position/1000) || 0);
  },
  progressCalculate: function (position, duration) {
    return position/duration*100 + "%";
  },
  render: function () {
    var sound = this.props.sound;

    return (
      <div className="progress">
        <div className="progress-background"></div>
        <div className="progress-bar" style={{width : this.progressCalculate(sound.position, sound.duration) + "%"}}></div>
        <div className="progress-text progress-current left">{this.toTime(sound.position)}</div>
        <div className="progress-text progress-total right">{this.toTime(sound.duration)}</div>
        <div className="clear"></div>
      </div>
    );
  }
});

var Info = React.createClass({
  render: function () {
    if (this.props.mix) {
      return (
        <div className="info">
          <div className="info-title">{this.props.mix.title}</div>
          <div className="info-artist">{this.props.mix.mixer}</div>
          <div className="info-track"></div>
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }
  }
})

var MixUrlForm = React.createClass({
  getInitialState: function () {
    return {url: "http://www.1001tracklists.com/tracklist/49409_steve-angello-third-party-bbc-radio-1-residency-2014-05-01.html"};
  },
  onChange: function(e) {
    this.setState({url: e.target.value});
  },
  handleSubmit: function (e) {
    e.preventDefault();
    this.props.onFetch(this.state.url);
    this.setState({url: ""});
  },
  render: function () {
    return (
      <div className="playlistBar">
        <div className="left">
          Playlist
        </div>
        <div className="right">
          <form onSubmit={this.handleSubmit}>
            <input onChange={this.onChange} value={this.state.url} />
            <input type="submit" />
          </form>
        </div>
        <div className="clear"></div>
      </div>
    );
  }
});

var Playlist = React.createClass({
  render: function () {
    var that = this;
    var items = Object.keys(this.props.mixes).map(function(mixKey) {
      var mix = that.props.mixes[mixKey];

      return <MixItem mix={mix} onDoubleClick={that.props.onDoubleClick} key={mix.title} />;
    });

    return (
      <div className="playlist">
        {items}
      </div>
    )
  }
});

var MixItem = React.createClass({
  handleDoubleClick: function () {
    this.props.onDoubleClick(this.props.mix);
  },
  render: function () {
    var mix = this.props.mix;

    return (
      <div className="playlistItem" onDoubleClick={this.handleDoubleClick}>
        {mix.title}
      </div>
    )
  }
});

React.renderComponent(<MixPlayer />, document.getElementById('mixplayer'));
