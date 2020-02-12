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
            sql =  `SELECT restan.oph AS oph,
                        restan.bcc AS bcc,
                        restan.tphrd AS tph_restant_day,
                        restan.lat AS latitude,
                        restan.lon AS longitude,
                        restan.jmljj AS jml_janjang,
                        restan.jmlbd AS jml_brondolan,
                        restan.kgtks AS kg_taksasi,
                        restan.tglrp AS tgl_report,
                        restan.werks AS werks,
                        restan.est_name AS est_name,
                        restan.afd_code AS afd_code,
                        restan.block_name AS block_name,
                        restan.block_code AS block_code
                    FROM mobile_inspection.tr_titik_restan restan
                    WHERE restan.werks IN( ${werksQuerySearch} )
                        AND restan.afd_code IN( ${afdQuerySearch} )
                    ORDER BY restan.werks ASC, restan.afd_code ASC, restan.block_name ASC
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
                SELECT werks, afd_code, SUM (kgtks) kg_taksasi
                FROM mobile_inspection.tr_titik_restan
                GROUP BY werks, afd_code
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