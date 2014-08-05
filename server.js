var express = require('express'),
    cronjobs = require('./routes/cronjobs'),
		frontend = require('./routes/frontend');
 
var app = express();

//Read from configuration file
var confFile = 'config.json';
var fs = require('fs');
var config = JSON.parse(fs.readFileSync(confFile));

app.get('/cronjobs', cronjobs.getAll);
app.get('/servers', cronjobs.getServers);

app.put('/start/:server/:job_id/:frequency', cronjobs.startJob);
app.put('/end/:server/:job_id', cronjobs.endJob);

app.get('/', frontend.index);

 

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
	  app.locals.pretty = true;		
		app.set('view options', {layout : false});
		app.set('view engine', 'jade');
		app.set('views', __dirname + '/views');
  	app.use(require('stylus').middleware(__dirname + '/public'));
		app.use(express.static(__dirname + '/public'));
});
 
app.listen(config.app_port);
console.log('Listening on port 3000...');
