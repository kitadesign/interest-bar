
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
			}
		}

	} );

	grunt.registerTask( 'default', [ 'uglify' ] );
};
