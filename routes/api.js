/*
|--------------------------------------------------------------------------
| Variable
|--------------------------------------------------------------------------
*/	
	// Controllers
	const Controllers = {
		v_1_0: {
			TestOracle: require( _directory_base + '/app/v1.0/Http/Controllers/TestOracleController.js' ),
			Inspection: require( _directory_base + '/app/v1.0/Http/Controllers/InspectionController.js' ),
			TitikRestan: require( _directory_base + '/app/v1.0/Http/Controllers/TitikRestanController.js' )
		}
	}
/*
 |--------------------------------------------------------------------------
 | Routing
 |--------------------------------------------------------------------------
 */
	module.exports = ( app ) => {
		/*
		 |--------------------------------------------------------------------------
		 | Welcome Message
		 |--------------------------------------------------------------------------
		 */
			app.get( '/', async function( req, res ) {
				return res.json( {
					message: "Oracle Sample Connection"
				} );
			} );

		/*
		 |--------------------------------------------------------------------------
		 | API Versi 1.0
		 |--------------------------------------------------------------------------
		 */
			app.get( '/api/v1.0/getdata', Controllers.v_1_0.TestOracle.getdata );
			app.get( '/api/v1.0/getdata/:ID', Controllers.v_1_0.TestOracle.getdata_by_parameter );
			app.post( '/api/v1.0/insertdata', Controllers.v_1_0.TestOracle.insertdata );
			app.put( '/api/v1.0/updatedata/:ID', Controllers.v_1_0.TestOracle.updatedata );
			app.delete( '/api/v1.0/deletedata/:ID', Controllers.v_1_0.TestOracle.deletedata );
			app.get( '/api/v1.0/columndata/:ID', Controllers.v_1_0.TestOracle.columndata );

			app.get( '/api/v1.0/inspection/data', Controllers.v_1_0.Inspection.getdata );
			app.get( '/api/v1.0/inspection/data/:ID', Controllers.v_1_0.Inspection.getdata_by_parameter );
			app.post( '/api/v1.0/inspection/insert', Controllers.v_1_0.Inspection.insertdata );
			app.put( '/api/v1.0/inspection/update/:ID', Controllers.v_1_0.Inspection.updatedata );
			app.delete( '/api/v1.0/inspection/delete/:ID', Controllers.v_1_0.Inspection.deletedata );

			app.get( '/api/v1.0/titikrestan/data', Controllers.v_1_0.TitikRestan.getdata );
			app.get( '/api/v1.0/titikrestan/data/:ID', Controllers.v_1_0.TitikRestan.getdata_by_parameter );
	}