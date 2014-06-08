window.Scraper = window.Scraper || {};

var request = require('request');
var cheerio = require('cheerio');

Scraper.fetchMix = function (url, callback) {
  console.log("requesting", url);

  request(url, function (error, response, body) {
    var $ = cheerio.load(body),
        titleString = $('.sideTop').first().text().split(/ (@|-) /);

    var data = {
      url: url,
      title: titleString[2],
      mixer: titleString[0],
      tracks: [],
      media: []
    };

    console.log(data);

    var tracks = $("#middleDiv .default .tlpItem");

    tracks.each(function (index, el) {
      var id = $(el).attr("id").split("_")[1],
          titleString = $(el).find(".trackValue").text().split(/ (@|-) /);

      data.tracks.push({
        "id": id,
        "number": $(el).find(".trackno").text().trim(),
        "start": $(el).find(".cueValueField").html(),
        "trackName": titleString[1],
      });
    });

    var media = $("#leftContent > div:nth-child(2) > table:nth-child(7) td");

    media.each(function (index, el) {
      var url = $(el).find("a").attr("href");

      data.media.push({
        url: url
      });
    });

    console.log(data);

    callback(null, data);
  });
};

Scraper.fetchSearch = function (query, callback) {
  request.post({
    url: 'http://www.1001tracklists.com/search/result.php',
    method: 'POST',
    form: {
      main_search: query,
      search_selection: 1
    }
  }, function (error, response, body) {
    var $ = cheerio.load(body);

    var entries = $("#middleDiv td.tl");


    var data = [];

    entries.each(function (index, el) {
      data.push({
        title: $(el).find(".tlLink a").text(),
        url: "http://www.1001tracklists.com" + $(el).find(".tlLink a").attr("href"),
        popularity: $(el).find("div.tlViewCount").text().trim(),
        hasSoundCloud: $(el).find('.sprite-soundcloud').length === 1
      });
    });

    callback(null, data);
  });
};
