/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	// Node Modules
	const OracleDB = require( 'oracledb' );

	// Set Database
	const DB_TAP_DW = database.tapdw;

/*
 |--------------------------------------------------------------------------
 | Versi 1.0
 |--------------------------------------------------------------------------
 */
 	/** 
 	  * F.getdata
	  * Untuk mengambil data berdasarkan query.
	  *
	  * URL: [GET] http://localhost:3000/api/v1.0/getdata
	  * --------------------------------------------------------------------
	*/
		exports.getdata = async ( req, res, next ) => {
			let connection;
			try {

				let sql, binds, options, result;

				connection = await OracleDB.getConnection( DB_TAP_DW );
				sql = `
					SELECT * FROM ERWIN WHERE ROWNUM < 10
				`;
				binds = {};
				options = {
					outFormat: OracleDB.OUT_FORMAT_OBJECT
				};
				result = await connection.execute( sql, binds, options );
   				var data = [];
   				for(var i = 0; i < result.rows.length;i++){
   					data[i] = result.rows[i].NAMA
   				};
				return res.json( {
					message: "OK",
					data: data//result.rows
				} );

			} catch ( err ) {
				console.log( err );
				return res.json( {
					message: "Error 1",
					data: []
				} );
			} finally {
				if ( connection ) {
					try {
						await connection.close();
					} catch ( err ) {
						console.error( err );
						return res.json( {
							message: "Error 2",
							data: []
						} );
					}
				}
			}
		}

	/** 
 	  * F.getdata_by_parameter
	  * Untuk mengambil data berdasarkan query dan parameter.
	  *
	  * URL: [GET] http://localhost:3000/api/v1.0/getdata/:ID
	  * PARAMETER: ID
	  * --------------------------------------------------------------------
	*/
		exports.getdata_by_parameter = async ( req, res, next ) => {
			let connection;
			try {

				let sql, binds, options, result;

				connection = await OracleDB.getConnection( DB_TAP_DW );
				sql = `
					SELECT * FROM ERWIN WHERE ID = '` + req.params.ID + `'
				`;
				binds = {};
				options = {
					outFormat: OracleDB.OUT_FORMAT_OBJECT
				};
				result = await connection.execute( sql, binds, options );
				return res.json( {
					message: "OK",
					data: result.rows
				} );

			} catch ( err ) {
				console.log( err );
				return res.json( {
					message: "Error 1",
					data: []
				} );
			} finally {
				if ( connection ) {
					try {
						await connection.close();
					} catch ( err ) {
						console.error( err );
						return res.json( {
							message: "Error 2",
							data: []
						} );
					}
				}
			}
		}

	/** 
 	  * F.insertdata
	  * Untuk insert data berdasarkan Raw Body.
	  *
	  * URL: [GET] http://localhost:3000/api/v1.0/insertdata
	  * BODY: ID, NAMA, TANGGAL( YYYY-MM-DD )
	  * --------------------------------------------------------------------
	*/
		exports.insertdata = async ( req, res, next ) => {
			let connection;
			try {

				let sql, binds, options, result;

				connection = await OracleDB.getConnection( DB_TAP_DW );
				sql = `
					INSERT INTO
						ERWIN(
							ID,
							NAMA,
							TANGGAL
						)
					VALUES (
						:ID,
						:NAMA,
						TO_DATE( :TANGGAL, 'RRRR-MM-DD' )
					)
				`;
				binds = {
					ID: req.body.ID,
					NAMA: req.body.NAMA,
					TANGGAL: req.body.TANGGAL
				};
				options = {
					outFormat: OracleDB.OUT_FORMAT_OBJECT,
					autoCommit: true
				};
				result = await connection.execute( sql, binds, options );

				return res.json( {
					message: "OK",
					data: result
				} );

			} catch ( err ) {
				console.log( err );
				return res.json( {
					message: "Error 1",
					data: []
				} );
			} finally {
				if ( connection ) {
					try {
						await connection.close();
					} catch ( err ) {
						console.error( err );
						return res.json( {
							message: "Error 2",
							data: []
						} );
					}
				}
			}
		}

	/** 
 	  * F.updatedata
	  * Untuk update data berdasarkan Raw Body dan parameter.
	  *
	  * URL: [GET] http://localhost:3000/api/v1.0/updatedata/:ID
	  * PARAMETER: ID
	  * BODY: NAMA, TANGGAL( YYYY-MM-DD )
	  * --------------------------------------------------------------------
	*/
		exports.updatedata = async ( req, res, next ) => {
			let connection;
			try {

				let sql, binds, options, result;

				connection = await OracleDB.getConnection( DB_TAP_DW );
				sql = `
					UPDATE
						ERWIN
					SET
						NAMA = :NAMA,
						TANGGAL = TO_DATE( :TANGGAL, 'RRRR-MM-DD' )
					WHERE
						ID = ` + parseInt( req.params.ID ) + `
				`;
				binds = {
					NAMA: req.body.NAMA,
					TANGGAL: req.body.TANGGAL
				};
				options = {
					outFormat: OracleDB.OUT_FORMAT_OBJECT,
					autoCommit: true
				};
				result = await connection.execute( sql, binds, options );

				return res.json( {
					message: "OK",
					data: result
				} );

			} catch ( err ) {
				console.log( err );
				return res.json( {
					message: "Error 1",
					data: []
				} );
			} finally {
				if ( connection ) {
					try {
						await connection.close();
					} catch ( err ) {
						console.error( err );
						return res.json( {
							message: "Error 2",
							data: []
						} );
					}
				}
			}
		}

	/** 
 	  * F.deletedata
	  * Untuk update data berdasarkan Raw Body dan parameter.
	  *
	  * URL: [GET] http://localhost:3000/api/v1.0/deletedata/:ID
	  * PARAMETER: ID
	  * --------------------------------------------------------------------
	*/
		exports.deletedata = async ( req, res, next ) => {
			let connection;
			try {

				let sql, binds, options, result;

				connection = await OracleDB.getConnection( DB_TAP_DW );
				sql = `
					DELETE FROM
						ERWIN
					WHERE
						ID = ` + parseInt( req.params.ID ) + `
				`;
				binds = {};
				options = {
					outFormat: OracleDB.OUT_FORMAT_OBJECT,
					autoCommit: true
				};
				result = await connection.execute( sql, binds, options );

				return res.json( {
					message: "OK",
					data: result
				} );

			} catch ( err ) {
				console.log( err );
				return res.json( {
					message: "Error 1",
					data: []
				} );
			} finally {
				if ( connection ) {
					try {
						await connection.close();
					} catch ( err ) {
						console.error( err );
						return res.json( {
							message: "Error 2",
							data: []
						} );
					}
				}
			}
		}

	/** 
 	  * F.selectcolumndata
	  * 
	  * URL: [GET] http://localhost:3000/api/v1.0/columndata/:ID
	  * PARAMETER: ID
	  * --------------------------------------------------------------------
	*/
		exports.columndata = async ( req, res, next ) => {
			let connection;
			try {

				let sql, binds, options, result;

				connection = await OracleDB.getConnection( DB_TAP_DW );
				sql = `
					SELECT `+ req.params.ID+ " " +req.params.ID + ` FROM ERWIN
				`;
				binds = {};
				options = {
					outFormat: OracleDB.OUT_FORMAT_OBJECT,
				};
				result = await connection.execute( sql, binds, options );

				return res.json( {
					message: "OK",
					data: result.rows
				} );

			} catch ( err ) {
				console.log( err );
				return res.json( {
					message: "Error 1",
					data: []
				} );
			} finally {
				if ( connection ) {
					try {
						await connection.close();
					} catch ( err ) {
						console.error( err );
						return res.json( {
							message: "Error 2",
							data: []
						} );
					}
				}
			}
		}	