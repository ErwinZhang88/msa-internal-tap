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
	const DB_MOBILE_INS = database.mobile_inspection_qa;

/*
 |--------------------------------------------------------------------------
 | Versi 1.0
 |--------------------------------------------------------------------------
 */
 	/** 
 	  * F.getdata
	  * Untuk mengambil data berdasarkan query.
	  *
	  * URL: [GET] http://localhost:3000/api/v1.0/titikrestan/data
	  * --------------------------------------------------------------------
	*/
		exports.getdata = async ( req, res, next ) => {
			let connection;
			try {

				let sql, binds, options, result;

				connection = await OracleDB.getConnection( DB_MOBILE_INS );
				sql = `
					SELECT restan.oph ,
				         restan.bcc,
				         restan.tph_restant_day ,
				         restan.latitude,
				         restan.longitude ,
				         SUM (jml_jjg) jml_Janjang,
				         SUM (jml_brondolan) jml_brondolan,
				         SUM (kg_taksasi) kg_taksasi,
				         restan.tgl_report tgl_report,
				         restan.werks ,
				         est.est_name ,
				         restan.afd_code ,
				         restan.sub_block_code block_code,
				         restan.sub_block_name block_name
				    FROM tap_dw.tr_hv_restant_detail@proddw_link restan LEFT JOIN tap_dw.tm_est@proddw_link est
				            ON restan.werks = est.werks
				   WHERE restan.tgl_report = TRUNC (SYSDATE - 1) AND restan.latitude != '0' AND restan.status_bcc = 'RESTAN'
				GROUP BY restan.werks,
				         est.est_name,
				         restan.afd_code,
				         restan.sub_block_code,
				         restan.sub_block_name,
				         restan.tph_restant_day,
				         restan.oph,
				         restan.latitude,
				         restan.longitude,
				         restan.bcc,
				         restan.tgl_report
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
	  * URL: [GET] http://localhost:3000/api/v1.0/titikrestan/data/:ID
	  * PARAMETER: ID
	  * --------------------------------------------------------------------
	*/
		exports.getdata_by_parameter = async ( req, res, next ) => {
			let connection;
			try {

				let sql, binds, options, result;

				connection = await OracleDB.getConnection( DB_MOBILE_INS );
				sql = `
					  SELECT restan.oph,
                             restan.bcc,
                             restan.tph_restant_day,
                             restan.latitude,
                             restan.longitude,
                             SUM (restan.jml_jjg) jml_janjang,
                             SUM (restan.jml_brondolan) jml_brondolan,
                             SUM (restan.kg_taksasi) kg_taksasi,
                             restan.tgl_report tgl_report,
                             restan.werks,
                             est.est_name,
                             restan.afd_code,
                             restan.sub_block_code block_code,
                             restan.sub_block_name block_name
                        FROM tap_dw.tr_hv_restant_detail@proddw_link restan LEFT JOIN tap_dw.tm_est@proddw_link est
                                ON restan.werks = est.werks
                       WHERE     restan.tgl_report = TRUNC (SYSDATE - 1)
                             AND restan.latitude != '0'
                             AND restan.status_bcc = 'RESTAN'
                             AND restan.werks || restan.afd_code || restan.block_code = '`+req.params.ID+`'
                    GROUP BY restan.werks,
                             est.est_name,
                             restan.afd_code,
                             restan.sub_block_code,
                             restan.sub_block_name,
                             restan.tph_restant_day,
                             restan.oph,
                             restan.latitude,
                             restan.longitude,
                             restan.bcc,
                             restan.tgl_report
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
					message: "Error 1 by param",
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

