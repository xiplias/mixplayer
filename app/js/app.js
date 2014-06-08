var request = require('request');
var semver = require('semver');
var gui = require('nw.gui');

soundManager.setup({});

request('https://s3-eu-west-1.amazonaws.com/mixplayer/versions.json', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var manifest = JSON.parse(body);

    if (manifest.newest_version && semver.gt(manifest.newest_version, gui.App.manifest.version)) {
      try {
        var Updater = require('node-webkit-mac-updater');

        var updater = new Updater({
            dmg_name: 'Mixplayer Installer',
            app_name: 'Mixplayer',
            source: {
                host: 's3-eu-west-1.amazonaws.com',
                port: 443,
                path: '/mixplayer/mixplayer'+manifest.newest_version+'.dmg'
            }
        });

        // updater.update(function(err){
        //     if (!err) console.log('App has been updated!');
        // });
      } catch (err) {
        console.log(err);
      }
    }
  }
});
