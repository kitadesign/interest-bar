var io = require( 'socket.io' )( 3000 );
var redis = require( 'socket.io-redis' );

io.adapter( redis( { host: 'localhost', port: 6379 } ) );

