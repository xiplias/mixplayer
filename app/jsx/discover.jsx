/** @jsx React.DOM */

var request = require('request');

Discover = React.createClass({
  getInitialState: function () {
    return {
      searchData: []
    };
  },
  setSearchData: function (data) {
    this.setState({
      searchData: data
    });
  },
  render: function () {
    return (
      <div className="discover">
        <MixUrlForm onAddMix={this.props.onAddMix} onSearchData={this.setSearchData} />
        <SearchResults onAddMix={this.props.onAddMix} searchData={this.state.searchData} />
      </div>
    );
  }
});

MixUrlForm = React.createClass({
  getInitialState: function () {
    return {url: ""};
  },
  onChange: function(e) {
    this.setState({url: e.target.value});
  },
  handleSubmit: function (e) {
    e.preventDefault();
    //this.props.onAddMix(this.state.url);

    var that = this;

    Scraper.fetchSearch(this.state.url, function (err, data) {
      that.props.onSearchData(data);
    });
  },
  render: function () {
    return (
      <div className="playlistBar" style={{width: 450, margin: "0 auto"}}>
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.onChange} value={this.state.url} style={{width: 350}}/>
          <input type="submit" />
        </form>
      </div>
    );
  }
});

SearchResults = React.createClass({
  render: function () {
    var that = this;

    var searchItems = this.props.searchData.map(function(item, i) {
      return <SearchItem item={item} onAddMix={that.props.onAddMix} key={item.title} />;
    });

    return (
      <div className="searchData">
        {searchItems}
      </div>
    )
  }
});

SearchItem = React.createClass({
  addMix: function () {
    this.props.onAddMix(this.props.item.url);
  },
  classNames: function () {
    if (this.props.item.hasSoundCloud) {
      return "searchItem";
    } else {
      return "searchItem lowkey";
    }
  },
  render: function () {
    var item = this.props.item;

    console.log(item);

    return (
      <div className={this.classNames()} onDoubleClick={this.addMix}>
        {item.title}
        <small>
          <a href={item.url} target="_blank">external</a>
          {item.hasSoundCloud}
        </small>
      </div>
    )
  }
});
