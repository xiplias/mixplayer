/** @jsx React.DOM */

Playlist = React.createClass({
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

MixItem = React.createClass({
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
