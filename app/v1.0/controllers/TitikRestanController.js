/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	
    const oracledb = require('oracledb');
    const dateFormat = require('dateformat');
 
     // Middleware
    //  const Date = require( _directory_base + '/app/v1.0/Http/Middleware/Date.js' );

     //Helper
     const Helper = require( _directory_base + '/app/utils/Helper.js' );

/*
 |--------------------------------------------------------------------------
 | Module Exports
 |--------------------------------------------------------------------------
*/
    exports.titikRestan = async ( req, res ) => {
        let userRole = req.auth.USER_ROLE;
        let reffRole = req.auth.REFFERENCE_ROLE;
        if ( userRole !== 'ASISTEN_LAPANGAN' ) {
            return res.send( {
                status: true,
                message: 'Bukan Asisten Lapangan',
                data: []
            } );
        }
        if( reffRole !== 'AFD_CODE' ) {
            return res.send( {
                status: true,
                message: 'Bukan AFD_CODE!',
                data: []
            } );
        }
        let locationCode = String( req.auth.LOCATION_CODE ).split( ',' );
        let werksQuerySearch = [];
        let afdQuerySearch = [];
        locationCode.forEach( function( location ) {
            werksQuerySearch.push( location.substring( 0, 4 ) );
            afdQuerySearch.push( location.substring( 4, 5 ) );
        } );
        werksQuerySearch = werksQuerySearch.map(werks => `'${werks}'`).join(',');
        afdQuerySearch = afdQuerySearch.map(afd => `'${afd}'`).join(',');
        try {
            let sql, binds, options, result;
            sql =  `SELECT 
                    restan.oph AS OPH, 
                    restan.bcc AS BCC,
                    restan.tph_restant_day,
                    restan.latitude, 
                    restan.longitude, 
                    SUM (jml_jjg) AS JML_JANJANG, 
                    SUM (jml_brondolan) AS JML_BRONDOLAN, 
                    SUM (kg_taksasi) AS KG_TAKSASI, 
                    restan.tgl_report, 
                    restan.werks, 
                    est.est_name, 
                    restan.afd_code, 
                    restan.sub_block_name AS BLOCK_NAME,
                    restan.sub_block_code AS BLOCK_CODE
                FROM 
                    tap_dw.tr_hv_restant_detail@proddw_link restan 
                    LEFT JOIN tap_dw.tm_est@proddw_link est ON restan.werks = est.werks 
                WHERE 
                    restan.tgl_report = TRUNC (SYSDATE-1) 
                    AND restan.latitude != '0' 
                    AND restan.status_bcc = 'RESTAN'
                    AND restan.TPH_RESTANT_DAY <= 15
                    AND restan.werks IN( ${werksQuerySearch} )
                    AND restan.afd_code IN( ${afdQuerySearch} )
                GROUP BY 
                    restan.werks, 
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
                ORDER BY
                    restan.werks ASC,
                    restan.afd_code ASC,
                    restan.sub_block_name ASC
            `;
            connection = await oracledb.getConnection( config.database );
            binds = {};
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT
                // extendedMetaData: true,
                // fetchArraySize: 100
            };
            result = await connection.execute( sql, binds, options );
            if(result) {
                result.rows.forEach(function(rs) {
                    rs.TGL_REPORT = dateFormat(rs.TGL_REPORT, 'yyyymmdd');
                    rs.KG_TAKSASI = parseInt(rs.KG_TAKSASI);
                });
                return res.send( {
                    status: true, 
                    message: 'Success',
                    data: result.rows
                } );
            }
            return res.send({
                status: true, 
                message: 'success',
                data:[]
            })
            
        } catch( err ) {
            return res.send( {
                status: false, 
                message: err.message,
                data: []
            } );
        }
    }

    //get kg taksasi
    exports.taksasi = async ( req, res ) => {
        let response = [];
        try {
            let sql, binds, options, result;
            sql = `
                SELECT restan.werks, restan.afd_code, SUM (kg_taksasi) AS kg_taksasi
                FROM tap_dw.tr_hv_restant_detail@proddw_link restan
                WHERE restan.tgl_report = TRUNC (SYSDATE-1) AND restan.latitude != '0' AND restan.status_bcc = 'RESTAN'
                GROUP BY restan.werks, restan.afd_code
            `;
            connection = await oracledb.getConnection( config.database );
            binds = {};
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT
                // extendedMetaData: true,
                // fetchArraySize: 100
            };
            result = await connection.execute( sql, binds, options );
            if (result) {
                result.rows.forEach(function(rs) {
                    response.push({
                        OTORISASI: rs.WERKS + rs.AFD_CODE,
                        TOTAL: rs.KG_TAKSASI
                    })
                })
            }
            return res.send( {
                status: true,
                message: 'Success',
                data: response
            } )
        } catch ( err ) {
            return res.send( {
                status: false,
                message: err.message,
                data: []
            } );
        }
    }