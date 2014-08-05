module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		bower_concat: {
			all: {
				dest: 'public/js/bower.js',
				dependencies: {
					'underscore': 'jquery',
					'backbone': ['underscore', 'jquery'],
				},
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'public/js/bower.min.js' : ['<%= bower_concat.all.dest %>'],
					'public/js/monicron.min.js' : 'public/js/monicron.js'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['bower_concat', 'uglify']);

};
