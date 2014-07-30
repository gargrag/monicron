var express = require('express'),
    cronjobs = require('./routes/cronjobs');
 
var app = express();

app.get('/cronjobs', cronjobs.getAll);
app.get('/cronjobs/:server', cronjobs.getPerServer);
app.get('/cronjobs/:server/:job_id', cronjobs.getPerId);

app.put('/start/:server/:job_id/:frequency', cronjobs.startJob);
app.put('/end/:server/:job_id', cronjobs.endJob);
 

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});
 
app.listen(3000);
console.log('Listening on port 3000...');

