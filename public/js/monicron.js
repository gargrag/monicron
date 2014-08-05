var app ={};

var formatDate = function(UTCString){
	formatedDate = "";
	if (UTCString){
		date = new Date(UTCString);
		formatedDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " " +
			date.getHours() + ":" + date.getMinutes();
	}
	return formatedDate;
}

$(document).ready(function(){
	app.CronJob = Backbone.Model.extend({
		defaults: {
			server: 'dummyserver.com',
			job_id: 'maintenance',
			started: new Date().toUTCString(),
			completed: false,
			frequency: 5
		}
	});

	app.Server = Backbone.Model.extend({
		defaults:{
			name: "dummy_name",
			ip: "192.168.1.1"
		}	
	});

	app.CronJobCollection = Backbone.Collection.extend({
		model: app.CronJob,
		url: '/cronjobs',
		parse: function(response) {
			return response;
		}
	});

	app.ServerCollection = Backbone.Collection.extend({
		model: app.Server,
		url: '/servers',
		parse: function(response){
			return response;
		}
	});

	app.cronJobCollection = new app.CronJobCollection();
	app.serverCollection = new app.ServerCollection();

	app.CronJobView = Backbone.View.extend({
		tagName: 'tr',
		template: _.template(jQuery('#item-template').html()),
		render: function(){
			this.$el.html(this.template({ "data": this.model.toJSON()}));
			return this.$el; // enable chained calls
		}
	});

	app.ServerView = Backbone.View.extend({
		tagName: 'li',
		template: _.template(jQuery('#server-template').html()),
		render: function(){
			this.$el.html(this.template({ "data": this.model.toJSON()}));
			return this.$el; // enable chained calls
		}
	});

	app.ServersView = Backbone.View.extend({
		el: '#server-list',
		initialize: function () {
			app.serverCollection.on('add', this.addOne, this);
			app.serverCollection.on('reset', this.addAll, this);
			app.serverCollection.fetch(); 
		},
		addOne: function (server) {
			var view = new app.ServerView({model: server});
			$('#server-list').prepend(view.render());
		},
		addAll: function (){
			$("#server-list").empty();
			app.serverCollection.each(this.addOne, this);
		}
	});

	app.AppView = Backbone.View.extend({
		el: '#cronjob-list',
		initialize: function () {
			app.cronJobCollection.on('add', this.addOne, this);
			app.cronJobCollection.on('reset', this.addAll, this);
			app.cronJobCollection.fetch(); 
		},
		addOne: function(cronjob){
			var view = new app.CronJobView({model: cronjob});
			$('#cronjob-list').append(view.render());
		},
		addAll: function(){
			$("#cronjob-list").empty();
			app.cronJobCollection.each(this.addOne, this);
		},
		newAttributes: function(){
			return {
				title: this.input.val().trim(),
				completed: false
			}
		}
	});

app.AppRouter = Backbone.Router.extend({
    routes: {
        "server/:server": "getPerServer",
    },

    getPerServer: function(server){
			app.cronJobCollection.fetch({
				"reset" : true,
				"data" : {"server" : server} 
			});
    }
});
	

	var appView = new app.AppView();
	var appRouter = new app.AppRouter();
	var serversView = new app.ServersView();

	$('.dropdown-toggle').dropdown();
	Backbone.history.start();

	window.setInterval(function(){
		app.cronJobCollection.fetch({reset: true});
	}, 30000);
});
