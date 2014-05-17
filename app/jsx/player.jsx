/** @jsx React.DOM */

Controls = React.createClass({
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

Volume = React.createClass({
  render: function () {
    return (
      <div className="volume right">
        <img className="icon" src="/build/app/public/svg/volume-off.svg" />
      </div>
    )
  }
});

Progress = React.createClass({
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

Info = React.createClass({
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
