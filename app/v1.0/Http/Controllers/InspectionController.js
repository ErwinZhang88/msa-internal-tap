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
	  * URL: [GET] http://localhost:3000/api/v1.0/inspection/data
	  * --------------------------------------------------------------------
	*/
		exports.getdata = async ( req, res, next ) => {
			let connection;
			try {

				let sql, binds, options, result;

				connection = await OracleDB.getConnection( DB_TAP_DW );
				sql = `
					SELECT * FROM TAP_DW.TR_INSPECTION_ERWIN WHERE ROWNUM < 10
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

			} catch ( err ){
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
	  * URL: [GET] http://localhost:3000/api/v1.0/inspection/data/:ID
	  * PARAMETER: ID
	  * --------------------------------------------------------------------
	*/
		exports.getdata_by_parameter = async ( req, res, next ) => {
			let connection;
			try {

				let sql, binds, options, result;

				connection = await OracleDB.getConnection( DB_TAP_DW );
				sql = `
					SELECT * FROM TAP_DW.TR_INSPECTION_ERWIN 
					WHERE BLOCK_INSPECT_CODE||CONTENT_INSPECT_CODE = '` + req.params.ID + `'
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
	  * Untuk mengambil data berdasarkan query dan parameter.
	  *
	  * URL: [GET] http://localhost:3000/api/v1.0/inspection/insert
	  * 
	  * --------------------------------------------------------------------
	*/
		exports.insertdata = async ( req, res, next ) => {
			let connection;
			try {

				let sql, binds, options, result;

				connection = await OracleDB.getConnection (DB_TAP_DW);
				sql = `
					INSERT INTO 
					TAP_DW.TR_INSPECTION_ERWIN
					(NATIONAL, REGION_CODE, COMP_CODE, EST_CODE, WERKS, SUB_BA_CODE, KEBUN_CODE, AFD_CODE, AFD_NAME, BLOCK_CODE, BLOCK_NAME, BLOCK_CODE_GIS, SUB_BLOCK_CODE, SUB_BLOCK_NAME, BLOCK_INSPECT_CODE, TANGGAL, CONTENT_INSPECT_CODE, CONTENT_NAME, NILAI, INSERT_USER, EMP_NAME, EMP_POSITION, INSPECTION_TYPE, INSERT_TIME_DW, UPDATE_TIME_DW)
					VALUES
					(:NATIONAL, :REGION_CODE, :COMP_CODE, :EST_CODE, :WERKS, :SUB_BA_CODE, :KEBUN_CODE, :AFD_CODE, :AFD_NAME, :BLOCK_CODE, :BLOCK_NAME, :BLOCK_CODE_GIS, :SUB_BLOCK_CODE, :SUB_BLOCK_NAME, :BLOCK_INSPECT_CODE, TO_DATE(:TANGGAL,'RRRR-MM-DD'), :CONTENT_INSPECT_CODE, :CONTENT_NAME, :NILAI, :INSERT_USER, :EMP_NAME, :EMP_POSITION, :INSPECTION_TYPE, TO_DATE(:INSERT_TIME_DW,'RRRR-MM-DD HH24:MI:SS'), TO_DATE(:UPDATE_TIME_DW,'RRRR-MM-DD HH24:MI:SS'))
				`;
				binds = {
					NATIONAL: req.body.NATIONAL, 
					REGION_CODE: req.body.REGION_CODE, 
					COMP_CODE: req.body.COMP_CODE, 
					EST_CODE: req.body.EST_CODE, 
					WERKS: req.body.WERKS, 
					SUB_BA_CODE: req.body.SUB_BA_CODE, 
					KEBUN_CODE: req.body.KEBUN_CODE, 
					AFD_CODE: req.body.AFD_CODE, 
					AFD_NAME: req.body.AFD_NAME, 
					BLOCK_CODE: req.body.BLOCK_CODE, 
					BLOCK_NAME: req.body.BLOCK_NAME, 
					BLOCK_CODE_GIS: req.body.BLOCK_CODE_GIS, 
					SUB_BLOCK_CODE: req.body.SUB_BLOCK_CODE, 
					SUB_BLOCK_NAME: req.body.SUB_BLOCK_NAME, 
					BLOCK_INSPECT_CODE: req.body. BLOCK_INSPECT_CODE, 
					TANGGAL: req.body.TANGGAL, 
					CONTENT_INSPECT_CODE: req.body.CONTENT_INSPECT_CODE,
					CONTENT_NAME: req.body.CONTENT_NAME, 
					NILAI: req.body.NILAI, 
					INSERT_USER: req.body.INSERT_USER, 
					EMP_NAME: req.body.EMP_NAME, 
					EMP_POSITION: req.body.EMP_POSITION, 
					INSPECTION_TYPE: req.body.INSPECTION_TYPE,
					INSERT_TIME_DW: req.body.INSERT_TIME_DW, 
					UPDATE_TIME_DW: req.body.UPDATE_TIME_DW
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
	  * URL: [GET] http://localhost:3000/api/v1.0/inspection/update/:ID
	  * PARAMETER: ID
	  * --------------------------------------------------------------------
	*/
		exports.updatedata = async ( req, res, next ) => {
			let connection;
			try {

				let sql, binds, options, result;

				connection = await OracleDB.getConnection( DB_TAP_DW );
				sql = `
					UPDATE
						TAP_DW.TR_INSPECTION_ERWIN
					SET
						NATIONAL= :NATIONAL,
						REGION_CODE= :REGION_CODE,
						COMP_CODE= :COMP_CODE,
						EST_CODE= :EST_CODE,
						WERKS= :WERKS,
						SUB_BA_CODE= :SUB_BA_CODE,
						KEBUN_CODE= :KEBUN_CODE,
						AFD_CODE= :AFD_CODE,
						AFD_NAME= :AFD_NAME,
						BLOCK_CODE= :BLOCK_CODE,
						BLOCK_NAME= :BLOCK_NAME,
						BLOCK_CODE_GIS= :BLOCK_CODE_GIS,
						SUB_BLOCK_CODE= :SUB_BLOCK_CODE,
						SUB_BLOCK_NAME= :SUB_BLOCK_NAME,
						TANGGAL= TO_DATE(:TANGGAL,'RRRR-MM-DD'),
						CONTENT_NAME= :CONTENT_NAME,
						NILAI= :NILAI,
						INSERT_USER= :INSERT_USER,
						EMP_NAME= :EMP_NAME,
						EMP_POSITION= :EMP_POSITION,
						INSPECTION_TYPE= :INSPECTION_TYPE,
						INSERT_TIME_DW= TO_DATE(:INSERT_TIME_DW, 'RRRR-MM-DD HH24:MI:SS'),
						UPDATE_TIME_DW= TO_DATE(:UPDATE_TIME_DW, 'RRRR-MM-DD HH24:MI:SS')
					WHERE
						BLOCK_INSPECT_CODE||CONTENT_INSPECT_CODE = '` + req.params.ID + `'
				`;
				binds = {
					NATIONAL: req.body.NATIONAL, 
					REGION_CODE: req.body.REGION_CODE, 
					COMP_CODE: req.body.COMP_CODE, 
					EST_CODE: req.body.EST_CODE, 
					WERKS: req.body.WERKS, 
					SUB_BA_CODE: req.body.SUB_BA_CODE, 
					KEBUN_CODE: req.body.KEBUN_CODE, 
					AFD_CODE: req.body.AFD_CODE, 
					AFD_NAME: req.body.AFD_NAME, 
					BLOCK_CODE: req.body.BLOCK_CODE, 
					BLOCK_NAME: req.body.BLOCK_NAME, 
					BLOCK_CODE_GIS: req.body.BLOCK_CODE_GIS, 
					SUB_BLOCK_CODE: req.body.SUB_BLOCK_CODE, 
					SUB_BLOCK_NAME: req.body.SUB_BLOCK_NAME, 
					TANGGAL: req.body.TANGGAL, 
					CONTENT_NAME: req.body.CONTENT_NAME, 
					NILAI: req.body.NILAI, 
					INSERT_USER: req.body.INSERT_USER, 
					EMP_NAME: req.body.EMP_NAME, 
					EMP_POSITION: req.body.EMP_POSITION, 
					INSPECTION_TYPE: req.body.INSPECTION_TYPE,
					INSERT_TIME_DW: req.body.INSERT_TIME_DW, 
					UPDATE_TIME_DW: req.body.UPDATE_TIME_DW
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
	  * URL: [GET] http://localhost:3000/api/v1.0/inspection/delete/:ID
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
						TAP_DW.TR_INSPECTION_ERWIN
					WHERE
						BLOCK_INSPECT_CODE||CONTENT_INSPECT_CODE = '` + req.params.ID + `'
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


		