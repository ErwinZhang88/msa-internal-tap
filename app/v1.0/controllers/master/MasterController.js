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
    exports.block = async ( req, res ) => {
        try {
            let sql, binds, options, result;
            sql =  `SELECT * FROM tap_dw.TM_SUB_BLOCK@dwh_link`;
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
                    rs.START_VALID = dateFormat(rs.START_VALID, 'yyyymmdd');
                    rs.END_VALID = dateFormat(rs.END_VALID, 'yyyymmdd');
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
            console.log(err)
            return res.send( {
                status: false, 
                message: err.message,
                data: []
            } );
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

    exports.afdeling = async ( req, res ) => {
        try {
            let sql, binds, options, result;
            sql =  `SELECT * FROM tap_dw.TM_AFD@dwh_link`;
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
                    rs.START_VALID = dateFormat(rs.START_VALID, 'yyyymmdd');
                    rs.END_VALID = dateFormat(rs.END_VALID, 'yyyymmdd');
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
            console.log(err)
            return res.send( {
                status: false, 
                message: err.message,
                data: []
            } );
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
          }
    }

    