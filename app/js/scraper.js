window.Scraper = window.Scraper || {};

Scraper.fetchMix = function (url, callback) {
  var request = require('request');
  var cheerio = require('cheerio');

  console.log("requesting", url);

  request(url, function (error, response, body) {
    console.log(body);
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

    callback(null, data);
  });
};
