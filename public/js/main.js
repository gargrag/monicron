$(document).ready(function(){
var app = {}; // create namespace for our app

app.CronJob = Backbone.Model.extend({
	defaults: {
		server: 'dummyserver.com',
		job_id: 'maintenance',
		completed: false,
		frequency: 5
	}
});

app.CronJobCollection = Backbone.Collection.extend({
	model: app.CronJob,
	url: '/cronjobs',
	parse: function(response) {
		console.log(response);
		return response;
	}
});

app.cronJobCollection = new app.CronJobCollection();

app.CronJobView = Backbone.View.extend({
	tagName: 'tr',
	template: _.template($('#item-template').html()),
	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		console.log(this);
		return this.$el; // enable chained calls
	}
});

app.AppView = Backbone.View.extend({
	el: '.container',
	initialize: function () {
		//this.input = this.$('#new-todo');
		// when new elements are added to the collection render then with addOne
		app.cronJobCollection.on('add', this.addOne, this);
		app.cronJobCollection.on('reset', this.addAll, this);
		app.cronJobCollection.fetch(); 
	},
	addOne: function(cronjob){
		var view = new app.CronJobView({model: cronjob});
		$('#cronjob-list').append(view.render());
	},
	addAll: function(){
		this.$('#cronjob-list').html(''); // clean the todo list
		app.cronJobCollection.each(this.addOne, this);
	},
	newAttributes: function(){
		return {
			title: this.input.val().trim(),
			completed: false
		}
	}
});



	var appView = new app.AppView();
});
