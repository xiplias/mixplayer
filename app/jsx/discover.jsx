/** @jsx React.DOM */

Discover = React.createClass({
  render: function () {
    return (
      <div className="discover">
        <MixUrlForm />
      </div>
    );
  }
});

MixUrlForm = React.createClass({
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