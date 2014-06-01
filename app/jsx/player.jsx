/** @jsx React.DOM */

Controls = React.createClass({
  play: function (event) {
    var newState = this.props.state == "playing" ? "playing" : "paused";

    this.props.onStateChange(newState);
  },
  stateImage: function () {
    if (this.props.state == 'playing') {
      return "/build/app/public/svg/pause.svg";
    } else {
      return "/build/app/public/svg/play.svg";
    }
  },
  render: function () {
    return (
      <div className="controls">
        <div className="controlGroup left">
          <img className="icon" src="/build/app/public/svg/previous.svg" />
          <img onClick={this.play} className="icon" src={this.stateImage()} />
          <img className="icon" src="/build/app/public/svg/next.svg" />
        </div>
        <Volume onVolumeChange={this.props.onVolumeChange} mute={this.props.mute} />
        <div className="clear"></div>
      </div>
    );
  }
});

Volume = React.createClass({
  volumeIcon: function () {
    console.log(this.props.mute);
    return this.props.mute ? "/build/app/public/svg/volume-off.svg" : "/build/app/public/svg/volume-up.svg"
  },
  handleClick: function () {
    console.log("change");
    this.props.onVolumeChange();
  },
  render: function () {
    return (
      <div className="volume right">
        <img className="icon" src={this.volumeIcon()} onClick={this.handleClick} />
      </div>
    )
  }
});

Progress = React.createClass({
  toTime: function (position) {
    return Format(Math.round(position/1000) || 0);
  },
  progressCalculate: function (position, duration) {
    return (position/duration*100)/2 + "%";
  },
  render: function () {
    var sound = this.props.sound;

    return (
      <div className="progress">
        <div className="progress-background"></div>
        <div className="progress-bar" style={{width : this.progressCalculate(sound.position, sound.duration) + "%"}}></div>
        <div className="progress-text">
          <div className="progress-current left">{this.toTime(sound.position)}</div>
          <div className="progress-total right">{this.toTime(sound.duration)}</div>
        </div>
        <div className="clear"></div>
      </div>
    );
  }
});

Info = React.createClass({
  render: function () {
    var mix = this.props.mix || {};

    return (
      <div className="info">
        <div className="info-title">{mix.title}</div>
        <div className="info-artist">{mix.mixer}</div>
        <div className="info-track"></div>
      </div>
    );
  }
})
