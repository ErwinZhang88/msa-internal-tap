/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
    const oracledb = require('oracledb');
    const dateformat = require('dateformat');
 /*
 |--------------------------------------------------------------------------
 | Module Exports
 |--------------------------------------------------------------------------
*/

    exports.petaPanenHeader = async (req, res) => {
        const auth = req.auth;
        if (auth.USER_ROLE != 'ASISTEN_LAPANGAN') {
            return res.send({
                status: true,
                message: 'bukan asisten lapangan',
                data: []
            });
        }
        try {
            let sql, binds, options, result;
            connection = await oracledb.getConnection(miDBConfig);
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
                        //ubah format tanggal
                        if (key == 'PER_TANGGAL' || key == 'TGL_PANEN') {
                            rs[key] = (dateformat(rs[key], 'yyyy-mm-dd' ));
                            continue;
                        }
                        rs[key] = formatValue(rs[key]);
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
    
    function formatValue(value) {
        //cek jika value number
        if(!isNaN(value)) {
            //cek jika value bernilai desimal
            if ((value % 1) != 0) {
                value = Math.round(value * 100) / 100;
            } else if (!value) {
                value = 0;
            }
        } else {
            if (!value) {
                value = "";
            }
        }
        return value;
    }
    exports.petaPanenDetail = async (req, res) => {
        const auth = req.auth;
        if (auth.USER_ROLE != 'ASISTEN_LAPANGAN') {
            return res.send({
                status: true,
                message: 'bukan asisten lapangan',
                data: []
            })
        }
        try {
            let sql, binds, options, result;
            connection = await oracledb.getConnection(miDBConfig);
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
                        rs[key] = formatValue(rs[key]);
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
            console.log(error)
            res.send({
                status: false,
                message: error.message,
                data: []
            });
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