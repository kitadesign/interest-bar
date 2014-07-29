var express        = require( 'express' ),
	http           = require( 'http' ),
	config         = require( 'config' ),
	socket         = require( 'socket.io' ),
	hbs            = require( 'hbs' ),
	compression    = require( 'compression' ),
	bodyParser     = require( 'body-parser' ),
	methodOverride = require( 'method-override' ),
	logger         = require( 'morgan' ),
	redis          = require( 'socket.io-redis' );

var app    = express();
var server = http.Server( app );
var io     = socket( server );

server.listen( config.server.port );

app.set( 'view engine', 'hbs' );
app.set( 'x-powered-by', false );
app.enable( 'trust proxy' );

app.use( logger() );
app.use( bodyParser.json( { limit: '50mb' } ) );
app.use( bodyParser.urlencoded( { extended: true, limit: '50mb' } ) );
app.use( methodOverride() );
app.use( compression() );
app.use( express.static( __dirname + '/public' ) );

hbs.registerHelper( require( __dirname + '/utils/hbs_helpers' ) );
io.adapter( redis( { host: 'localhost', port: 6379 } ) );

var results = {};
results.root = config.server.host + ( ( config.server.port && config.server.port !== 80 ) ? ':' + config.server.port : '' );
results.ns   = config.namespace;

app.get( '/', function ( req, res ) {
	res.set( 'Cache-Control', 'public, max-age=' + ( config.max_age / 1000 ) );
	res.render( 'index', results );
} );

app.get( '/load.js', function ( req, res ) {
	res.set( 'Cache-Control', 'public, max-age=' + ( config.max_age / 1000 ) );
	res.set( 'Content-Type', 'application/json; charset=utf-8' );
	res.render( 'load', results );
} );

io.on( 'connection', function ( socket ) {
	socket.on( 'access', function ( data ) {
		socket.broadcast.emit( data.url, 1 );
	} );
} );
