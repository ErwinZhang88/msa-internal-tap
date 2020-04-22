/*
|--------------------------------------------------------------------------
| Global APP Init
|--------------------------------------------------------------------------
*/
	process.env.ORA_SDTZ = 'UTC';
	global._directory_base = __dirname;
	global.config = {};
		config.app = require( './config/app.js' );
		config.database = require( './config/database.js' )[config.app.env];
	global.miDBConfig = config.database.mobileInspection;
	global.patroliDBConfig = config.database.patroliApi;

/*
|--------------------------------------------------------------------------
| APP Setup
|--------------------------------------------------------------------------
*/
	// Node Modules
	const BodyParser = require( 'body-parser' );
	const Express = require( 'express' );
	const App = Express();
	const CronJob = require( 'cron' ).CronJob;
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
	var Server = App.listen( parseInt( config.app.port[config.app.env] ), () => {
		console.log( 'Server' );
		console.log( "\tStatus \t\t: OK" );
		console.log( "\tService \t: " + config.app.name + " (" + config.app.env + ")" );
		console.log( "\tPort \t\t: " + config.app.port[config.app.env] );

		console.log("Database");
		console.log( "\tDB Server \t: " + config.database.mobileInspection.connectString + " (" + config.app.env + ")" );
	} );
	//Kernel
	const Kernel = require( _directory_base + '/app/v1.0/Console/Kernel.js' );
/*
 |--------------------------------------------------------------------------
 | Routing
 |--------------------------------------------------------------------------
 */
	require( './routes/api.js' )( App );

/*
 |--------------------------------------------------------------------------
 | Kafka
 |--------------------------------------------------------------------------
 */
	const Kafka = require(_directory_base + '/app/utils/Kafka.js');
	Kafka.consumer()
	