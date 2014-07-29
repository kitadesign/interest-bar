
module.exports = function ( grunt ) {
	var pkg = grunt.file.readJSON( 'package.json' );
	var taskName;
	for ( taskName in pkg.dependencies ) {
		if ( taskName.substring( 0, 6 ) == 'grunt-' ) {
			grunt.loadNpmTasks( taskName );
		}
	}

	// Project configuration.
	grunt.initConfig( {
		pkg: pkg,

		uglify: {
			compile: {
				files: [ {
					expand: true,
					cwd: 'views',
					src: [ '**/*.js', '!libs/**/*', '!min/**/*' ],
					dest: 'views/min/'
				} ]
			},
			minify: {
				files: {
					'views/min/socket-io.min.js': [
						'node_modules/socket.io-client/socket.io.js'
					]
				}
			}
		}

	} );

	grunt.registerTask( 'default', [ 'uglify' ] );
};
