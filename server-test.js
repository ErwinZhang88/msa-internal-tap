/*
|--------------------------------------------------------------------------
| Global APP Init
|--------------------------------------------------------------------------
*/
	global._directory_base = __dirname;

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

	App.get( '/', async function( req, res ) {
		return res.json( {
			message: "Hi Mas Erwin"
		} );
	} );

	App.get( '/hello-world', async function( req, res ) {
		return res.json( {
			message: "Hello World"
		} );
	} );

	App.post( '/hello-world', async function( req, res ) {
		return res.json( {
			message: "Get Post Variable",
			data: req.body
		} );
	} );