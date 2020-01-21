/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
    const oracledb = require('oracledb');

 /*
 |--------------------------------------------------------------------------
 | Module Exports
 |--------------------------------------------------------------------------
*/

    exports.petaPanenHeader = async (req, res) => {
        const auth = req.auth;
        try {
            let sql, binds, options, result;
            connection = await oracledb.getConnection(config.database);
            let LOCATION_CODE = auth.LOCATION_CODE;
		    LOCATION_CODE = LOCATION_CODE.split(',');
            LOCATION_CODE = LOCATION_CODE.map(LOCATION => `'${LOCATION}'`).join(',');
            let whereCondition = ``;

            switch (auth.REFFERENCE_ROLE) {
                case 'NATIONAL':
                    whereCondition += "";
                break;
                case 'COMP_CODE':
                    whereCondition += `WHERE COMP_CODE IN( ${LOCATION_CODE} )`;
                break;
                case 'BA_CODE':
                    whereCondition += `WHERE WERKS IN( ${LOCATION_CODE} )`;
                break;
                case 'AFD_CODE':
                    whereCondition += `WHERE WERKS || AFD_CODE IN( ${LOCATION_CODE} )`;
                break;
                // case 'AFD_CODE':
                //     whereCondition += `SD.WERKS || SD.AFD_CODE || SD.BLOCK_CODE IN( ${LOCATION_CODE} )`;
                // break;
            }
            sql = `SELECT * FROM mobile_inspection.tr_peta_panen_afd
                    ${whereCondition}`;
            binds = {};
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT
                // extendedMetaData: true,
                // fetchArraySize: 100
            };
            result = await connection.execute( sql, binds, options );
            res.send({
                status: true,
                message: 'Success!',
                data: result.rows
            });

        } catch (error) {
            res.send({
                status: false,
                message: error.message,
                data: []
            });
        }
    }
    exports.petaPanenDetail = async (req, res) => {
        const auth = req.auth;
        try {
            let sql, binds, options, result;
            connection = await oracledb.getConnection(config.database);
            let LOCATION_CODE = auth.LOCATION_CODE;
		    LOCATION_CODE = LOCATION_CODE.split(',');
            LOCATION_CODE = LOCATION_CODE.map(LOCATION => `'${LOCATION}'`).join(',');
            let whereCondition = ``;

            switch (auth.REFFERENCE_ROLE) {
                case 'NATIONAL':
                    whereCondition += "";
                break;
                case 'COMP_CODE':
                    whereCondition += `WHERE COMP_CODE IN( ${LOCATION_CODE} )`;
                break;
                case 'BA_CODE':
                    whereCondition += `WHERE WERKS IN( ${LOCATION_CODE} )`;
                break;
                case 'AFD_CODE':
                    whereCondition += `WHERE WERKS || AFD_CODE IN( ${LOCATION_CODE} )`;
                break;
                // case 'AFD_CODE':
                //     whereCondition += `SD.WERKS || SD.AFD_CODE || SD.BLOCK_CODE IN( ${LOCATION_CODE} )`;
                // break;
            }
            sql = `SELECT * FROM mobile_inspection.tr_peta_panen_block
                    ${whereCondition}`;
            binds = {};
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT
                // extendedMetaData: true,
                // fetchArraySize: 100
            };
            result = await connection.execute( sql, binds, options );
            res.send({
                status: true,
                message: 'Success!',
                data: result.rows
            });
        } catch (error) {
            res.send({
                status: false,
                message: error.message,
                data: []
            });
        }
    }