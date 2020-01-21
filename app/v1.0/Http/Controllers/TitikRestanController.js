/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	
    const oracledb = require('oracledb');
 
     // Middleware
    //  const Date = require( _directory_base + '/app/v1.0/Http/Middleware/Date.js' );

     //Helper
     const Helper = require( _directory_base + '/app/v1.0/Http/Libraries/Helper.js' );

/*
 |--------------------------------------------------------------------------
 | Module Exports
 |--------------------------------------------------------------------------
*/
    exports.titik_restan = async ( req, res ) => {
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
        try {
            let date = parseInt( Helper.date_format( 'now', 'YYYYMMDD' ) ).toString().substring( 0, 8 ) - 1;
            let titikRestan = await TitikRestanSchema.aggregate( [
                {
                    $match: {
                        TGL_REPORT: date, 
                        WERKS: { $in: werksQuerySearch },
                        AFD_CODE: { $in: afdQuerySearch } 
                    }
                }, {
                    $project: {
                        _id: 0
                    }
                }
            ] );
            return res.send( {
                status: true, 
                message: 'Success',
                data: titikRestan
            } );
        } catch( err ) {
            return res.send( {
                status: false, 
                message: config.error_message.find_500,
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
                WHERE restan.tgl_report = TRUNC (SYSDATE) AND restan.latitude != '0' AND restan.status_bcc = 'RESTAN'
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