/** @jsx React.DOM */
var request = require('request');

var MixPlayer = React.createClass({
  getInitialState: function() {
    return {
      mixes: {},
      playing: {},
      sound: null,
      currentMix: null,
      mute: false
    };
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

      return mix;
    });
  },
  addSong: function (url) {
    console.log("addmjix", url);
    var mix = this.fetch(url);
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
  setVolume: function () {
    soundManager.mute();
    this.setState({
      mute: !this.state.mute
    });
  },
  render: function () {
    return (
      <div className="mixplayerWindow">
        <div className="playerWindow left">
          <div>
            <Info mix={this.state.currentMix} />
            <Progress sound={this.state.playing}/>
            <Controls state={this.state.state} onStateChange={this.stateChange} onVolumeChange={this.setVolume} mute={this.state.mute} />
          </div>
          <Playlist mixes={this.state.mixes} onDoubleClick={this.playSong} />
        </div>
        <div className="discoverWindow left">
          <Discover onAddMix={this.addSong} onPlayMix={this.playSong} />
        </div>
        <div className="clear"></div>
      </div>
    );
  }
});

React.renderComponent(<MixPlayer />, document.getElementById('mixplayer'));
