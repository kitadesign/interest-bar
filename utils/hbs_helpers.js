var fs = require( 'fs' );
var config = require( 'config' );
var fileCache = {};

module.exports = {
	loadmodule: function ( name ) {
		try {
			var path = __dirname + '/../' + name + '.js';
			if ( !fileCache[ path ] || config.debug ) fileCache[ path ] = fs.readFileSync( path, 'utf8' );
			return fileCache[ path ];
		} catch ( e ) {
			return '';
		}
	},
	loadlibs: function ( name ) {
		try {
			var path = __dirname + '/../views/libs/' + name + '.js';
			if ( !fileCache[ path ] || config.debug ) fileCache[ path ] = fs.readFileSync( path, 'utf8' );
			return fileCache[ path ];
		} catch ( e ) {
			return '';
		}
	},
	load: function ( file, name ) {
		try {
			var dir = ( config.debug ) ? 'views' : 'views/min' ;
			var path = __dirname + '/../' + dir + '/' + file + '.js';
			if ( !fileCache[ path ] || config.debug ) {
				var program = fs.readFileSync( path, 'utf8' ).trim().replace( 'module.exports', '' );
				fileCache[ path ] =
					'( function () {' +
					' if ( ns.' + name + ' ) return;' +
					' ns.' + name + program +
					'} )();';
			}
			return fileCache[ path ];
		} catch ( e ) {
			return '';
		}
	},
	json: function ( data ) {
		return JSON.stringify( data );
	}
};
