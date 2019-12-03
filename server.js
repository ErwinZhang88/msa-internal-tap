/*
|--------------------------------------------------------------------------
| Global APP Init
|--------------------------------------------------------------------------
*/
	process.env.ORA_SDTZ = 'UTC';
	global._directory_base = __dirname;
	global.database = require( './config/database.js' );

/*
|--------------------------------------------------------------------------
| APP Setup
|--------------------------------------------------------------------------
*/
	// Node Modules
	const BodyParser = require( 'body-parser' );
	const Express = require( 'express' );

	// Primary Variable
	const App = Express();

/*
|--------------------------------------------------------------------------
| APP Init
|--------------------------------------------------------------------------
*/
	// Parse request of content-type - application/x-www-form-urlencoded
	App.use( BodyParser.urlencoded( { extended: false } ) );

	// Parse request of content-type - application/json
	App.use( BodyParser.json() );

	// Server Running Message
	var Server = App.listen( 3000, () => {
		console.log( "Run on port 3000" )
	} );

	// Routing
	require( './routes/api.js' )( App );
	module.exports = App;