Resolver = {
  determineSources: function (array) {
    var sortedSources = {};
    this.sources.map(function (source) {
      if(!sortedSources[source.name]) sortedSources[source.name] = {};


    });
  },
  determineSource: function (url) {

  },
  sources: [
    {
      name: "Soundcloud",
      isSource: function () {
        return true;
      },
      soundUrl: function (url, callback) {
        return "url";
      },
      resolve: function (url, callback) {
        var request = require('request');
        var resolveUrl = "http://api.soundcloud.com/resolve.json?url=" + url + "&client_id=ccf4b730db624e5d43a9f8f69491b157";

        request(resolveUrl, function (error, response, body) {
          console.log(response);
          callback(null, body);
        });
      }
    }
  ]
};
