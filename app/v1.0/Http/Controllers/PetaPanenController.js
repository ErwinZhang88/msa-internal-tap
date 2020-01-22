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
            if (result.rows) {
                result.rows.forEach(function (rs) {
                    //format value yang decimal menjadi 2 angka dibelakang koma 
                    for(let key in rs) {
                        rs[key] = formatNumberValue(rs[key]);
                    }
                });
                return res.send({
                    status: true,
                    message: 'Success!',
                    data: result.rows
                });
            } else {
                return res.send({
                    status: true,
                    message: 'success',
                    data: []
                })
            }
        } catch (error) {
            res.send({
                status: false,
                message: error.message,
                data: []
            });
        }
    }
    
    function formatNumberValue(value) {
        //cek jika value number
        if(!isNaN(value)) {
            //cek jika value bernilai desimal
            if ((value % 1) != 0) {
                value = Math.round(value * 100) / 100;
            }
        }
        return value;
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
            if (result.rows) {
                result.rows.forEach(function (rs) {
                    //format value yang decimal menjadi 2 angka dibelakang koma 
                    for(let key in rs) {
                        rs[key] = formatNumberValue(rs[key]);
                    }
                });
                return res.send({
                    status: true,
                    message: 'Success!',
                    data: result.rows
                });
            } else {
                return res.send({
                    status: true,
                    message: 'success',
                    data: []
                })
            }
        } catch (error) {
            res.send({
                status: false,
                message: error.message,
                data: []
            });
        }
    }