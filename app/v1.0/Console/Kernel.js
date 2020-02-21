/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
    const OracleDB = require( 'oracledb' );
    // Primary Variable
    const Kafka = require( _directory_base + '/app/utils/KafkaServer.js' );
    const Helper = require( _directory_base + '/app/utils/Helper.js' )

    class Kernel {
        async pushKafka() {
            let connection;
            try {
                let sql, binds, options, result;
                connection = await OracleDB.getConnection( config.database );
                sql = `
                    SELECT 
                        restan.oph AS OPH, 
                        restan.bcc AS BCC,
                        restan.tph_restant_day,
                        restan.latitude, 
                        restan.longitude, 
                        SUM (jml_jjg) AS JML_JANJANG, 
                        SUM (jml_brondolan) AS JML_BRONDOLAN, 
                        ROUND(SUM (kg_taksasi)) AS KG_TAKSASI, 
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
                        restan.tgl_report = TRUNC (SYSDATE - 1) 
                        AND restan.latitude != '0' 
                        AND restan.status_bcc = 'RESTAN' 
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
                binds = {};
                options = {
                    outFormat: OracleDB.OUT_FORMAT_OBJECT
                    // extendedMetaData: true,
                    // fetchArraySize: 100
                };
                result = await connection.execute( sql, binds, options );
                if ( result ) {
                    console.log( result.rows.length );
                    result.rows.forEach( function ( row ) {
                        if ( row.TGL_REPORT ) {
                            row.TGL_REPORT = row.TGL_REPORT.toISOString().
                            replace(/T/, ' ').      // replace T with a space
                            replace(/\..+/, '');
                            let kafkaBody = {
                                OPH: row.OPH,
                                BCC: row.BCC,
                                TPHRD: row.TPH_RESTANT_DAY,
                                LAT: row.LATITUDE,
                                LON: row.LONGITUDE,
                                JMLJJ: row.JML_JANJANG,
                                JMLBD: row.JML_BRONDOLAN,
                                KGTKS: row.KG_TAKSASI,
                                TGLRP: parseInt( Helper.date_format( row.TGL_REPORT, 'YYYYMMDD' ).substring( 0,8 ) ),
                                WERKS: row.WERKS,
                                EST_NAME: row.EST_NAME,
                                AFD_CODE: row.AFD_CODE,
                                BLOCK_CODE: row.BLOCK_CODE,
                                BLOCK_NAME: row.BLOCK_NAME
                            }
                            // Kafka.producer( 'WEB_REPORT_TITIK_RESTAN', JSON.stringify( kafkaBody ) );	
                        }
                    } )
                }
            } catch ( err ) {
                console.error(err);
            } finally {
                if ( connection ) {
                    try {
                        await connection.close();
                    } catch ( err ) {
                        console.error( err.message );
                    }
                }
            }
        }
    }

/*
 |--------------------------------------------------------------------------
 | Export 
 |--------------------------------------------------------------------------
 |*/

 module.exports = new Kernel();