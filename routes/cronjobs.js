var mongo = require('mongodb');

var Server = mongo.Server,
Db = mongo.Db,
BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('monitron_db', server);

db.open(function(err, db) {
	if(!err) {
		console.log("Connected to 'monitron_db' database");
		db.collection('cronjobs', {strict:true}, function(err, collection) {
			if (err) {
				console.log("The 'cronjobs' collection doesn't exist. Creating it with sample data...");
				populateDB();
			}
		});
	}else{
		console.log(err);
	}
});

exports.getAll = function(req, res) {		
	db.collection('cronjobs', function(err, collection) {
		collection.find().toArray(function(err, items) {
			res.send(items);
			console.log(items);
		});
	});
};

exports.getPerServer = function(req, res) {		
	db.collection('cronjobs', function(err, collection) {
		collection.find({ server: req.params.server }).toArray(function(err, items) {
			res.send(items);
		});
	});
};

exports.getPerId = function(req, res) {		
	var id = {
		server: req.params.server,
		job_id: req.params.job_id
	}

	db.collection('cronjobs', function(err, collection) {
		collection.find(id).toArray(function(err, items) {
			res.send(items);
		});
	});
};

exports.startJob = function(req, res) {

	var date = new Date();

	var cronjob = {
		_id: {
			server: req.params.server,
			job_id: req.params.job_id
		},
		server: req.params.server,
		job_id: req.params.job_id,
		frequency: req.params.frequency,
		started: date.toUTCString(),
		state: { id: 0, name: "running" }
	}

	console.log('Starting cronjob: ' + JSON.stringify(cronjob));		

	db.collection('cronjobs', function(err, collection) {
		collection.insert(cronjob, {safe:true}, function(err, result) {
			if (err) {
				redoJob(cronjob);
				res.send({'error':'An error has occurred, maybe an overlapped cronjob'});
			} else {
				console.log('Success: ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
}

exports.endJob = function(req, res){
	var date = new Date();

	var id = {
		server: req.params.server,
		job_id: req.params.job_id
	}

	var update = {
		$set:{ 
			"ended" : date.toUTCString(),
			"state" : {
				id: 1,
				name: "done"
			}				
		}
	}

	console.log('Stopping cronjob: ' + JSON.stringify(id));

	db.collection('cronjobs', function(err, collection){
		collection.update(id, update, {safe:true}, function(err, result){
			if (err) {
				res.send({'error': 'An error has ocurred'});
			}else{
				res.send(result[0]);
			}
		});
	});

}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

	var cronjobs = [
		{
		server: "test_server",
		job_id: "maintenance",
		frequency: 5,
		started: new Date().toUTCString(),
		state: {id: 0, name: "running"}
	},
	];

	db.collection('cronjobs', function(err, collection) {
		collection.insert(cronjobs, {safe:true}, function(err, result) {});
	});

};

var humanDate = function(timestamp){
	var date = new Date(timestamp);
	return date.getFullYear + '-' + date.getMonth()++ + '-' + date.getDate() + ' ' +
		date.getHours() + ':' + date.getMinutes();
}

var redoJob = function(cronjob){
	var date = new Date();

	var update = {
		$set: {
			"started" : date.toUTCString(),
			"state" : {
				id: 3,
				name: "overlapped"
			}
		},
		$inc:{ "overlap": 1}
	};
	db.collection('cronjobs', function(err, collection) {
		collection.update(cronjob._id, update, {safe: true}, function(err, result){});
	});
}
