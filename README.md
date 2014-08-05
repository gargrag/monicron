# MONICRON

BE ADVISED THIS README LACKS LOVE

Simple visual cronjob monitoring.
This tool was made to those who has a lot of cronjob tasks running on many servers, and want an easy and out-of-the-box solution to know whats happen at a glance. And keep the things under control.

The application is made 100% under JS and uses mongodb as a database server.

## Installation

To host your own installation, follow these steps.

### Previous setup
To run this project, you need to have installed [npm](https://www.npmjs.org/), [nodejs](http://nodejs.org/), and [mongodb](http://www.mongodb.org/) in your server. Refer to the documentation of each tool for specific installation instructions.

### Project setup
The project uses [GruntJS](http://gruntjs.com) to automate frontend tasks and [Bower](http://bower.io/) to manage frontend dependencies.

I recommend you to install these tools globally

	$ npm install -g bower
	$ npm install -g grunt

Now, you have to clone the repo and setup a few little things.

	$ git clone https://github.com/gargrag/monicron.git

ChDir into the directory and, follow these steps to get all the thing done.

	$ npm install # install node dependencies
	$ bower install # grab all the frontend libraries
	$ grunt # run the default Grunt task (will concat and minify the js code)
	$ mv config_sample.json config.json # and then edit your config file.

You're done!, run 
	$ node server.js
And that's it

## How to use
Monicron api is very simple, you just need to make some requests to the server. And let monicron display your data.

Is your responsability to manage server_id and job_id. It's simple, but take care.


### Cronjob start

	curl -v http://localhost:3000/start/[server_id]/[job_id]/[frequency]
	
### Cronjob stop

	curl -v http://localhost:3000/end/[server_id]/[job_id]
	

	





 
