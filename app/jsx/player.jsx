/** @jsx React.DOM */

var MixPlayer = React.createClass({
  getInitialState: function() {
    return {mix: {}, sound: {}};
  },
  fetch: function (url) {
    var that = this;
    Scraper.fetchMix(url, function (err, mix) {
      that.setState({mix: mix});
    });
  },
  render: function () {
    return (
      <div>
        <Info mix={this.state.mix} />
        <Progress />
        <Controls />
        <MixUrlForm onFetch={this.fetch} />
      </div>
    );
  }
});

var Controls = React.createClass({
  play: function (event) {
  },
  render: function () {
    return (
      <div className="controls">
        <img className="icon" src="/build/app/public/svg/previous.svg" />
        <img onClick={this.play} className="icon" src="/build/app/public/svg/play.svg" />
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
  render: function () {
    return (
      <div className="progress">
        <div className="progress-background"></div>
        <div className="progress-bar"></div>
        <div className="progress-text progress-current">1:28</div>
        <div className="progress-text progress-total">1:25:34</div>
      </div>
    );
  }
});

var Info = React.createClass({
  render: function () {
    return (
      <div className="info">
        <div className="info-title">{this.props.mix.title}</div>
        <div className="info-artist">{this.props.mix.mixer}</div>
        <div className="info-track">{"0:00 - 1:20 Watermat - Bullit [SPINNIN' DEEP]"}</div>
      </div>
    );
  }
})

var MixUrlForm = React.createClass({
  getInitialState: function() {
    return {url: ""};
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
      <form onSubmit={this.handleSubmit}>
        <input onChange={this.onChange} value={this.state.url} />
        <input type="submit" />
      </form>
    );
  }
});

React.renderComponent(<MixPlayer />, document.getElementById('mixplayer'));
