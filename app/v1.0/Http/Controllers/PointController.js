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
    const Client = require('node-rest-client').Client;

    const client = new Client();
    const axios = require('axios');

/*
 |--------------------------------------------------------------------------
 | Module Exports
 |--------------------------------------------------------------------------
*/
    //function untuk mendapat point current user
    exports.myPoint = async ( req, res ) => {
        let authCode = req.auth.USER_AUTH_CODE;
        try {
            let sql, binds, options, result, connection;
            connection = await oracledb.getConnection( config.database );
            sql = `SELECT * FROM mobile_inspection.tr_leader_board WHERE USER_AUTH_CODE = ${authCode}`;
            binds = {};
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT
                // extendedMetaData: true,
                // fetchArraySize: 100
            };
            result = await connection.execute( sql, binds, options );
            if (result.rows) {
                if (result.rows.length > 0) {
                    let point = {
                        POINT: result.rows[0].TOTAL_POIN ? result.rows[0].TOTAL_POIN : 0
                    }
                     return res.send({
                        status: true,
                        message: 'Success!',
                        data: point
                    });
                } 
            }
            res.send({
                status: true,
                message: 'Success!',
                data: { POINT : 0 }
            });
            
        } catch(err) {
            console.log(err);
            return res.send({
                status: true,
                message: err.message,
                data: []
            });
        }
       
    }

    //function untuk mendapatkan point other user
    exports.userPoint = async ( req, res ) => {
        const authCode = req.auth.USER_AUTH_CODE;
        let responseResult = [];
        try {
            let sql, binds, options, result;
            connection = await oracledb.getConnection( config.database );
            sql = `SELECT * FROM mobile_inspection.tr_leader_board WHERE USER_AUTH_CODE = ${authCode}`;
            binds = {};
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT
                // extendedMetaData: true,
                // fetchArraySize: 100
            };
            result = await connection.execute( sql, binds, options );
            if (result.rows) {
                await Promise.all( result.rows.map(async function (rs) {
                    let data = {};
                    // console.log(rs);
                    let userAuthCodes = [];
                    userAuthCodes.push({
                        TYPE: rs.TIPE,
                        CURRENT_USER: rs.USER_AUTH_CODE,
                        FIRST_USER: rs.RANK_1_AUTH,
                        SECOND_USER: rs.RANK_2_AUTH,
                        THIRD_USER: rs.RANK_3_AUTH,
                        FOURTH_USER: rs.DATA_1_AUTH,
                        FIFTH_USER: rs.DATA_2_AUTH,
                        SIXTH_USER: rs.DATA_3_AUTH  
                    });
                    data.AUTH_CODES = userAuthCodes;
                    let imageURLs = await getImageURL(data, req);
                    // let arrayImageURLs = [];
                    // for(let i = 0; i < imageURLs.length; i++) {
                    //     for(let firstKey in imageURLs[i]) {
                    //         arrayImageURLs.push(imageURLs[i]);
                    //     }
                    // }
                    // console.log(arrayImageURLs);
                    let users = await getUserProfile(data, req);
                    for(let i = 0; i < users.length; i++) {
                        for(let firstKey in users[i]) {
                            for(let secondKey in users[i][firstKey]) {
                                if(users[i][firstKey][secondKey]){
                                    for(let imageKey in imageURLs[i][firstKey]){
                                        if(users[i][firstKey][secondKey].USER_AUTH_CODE === imageKey) {
                                            users[i][firstKey][secondKey].IMAGE_URL = imageURLs[i][firstKey][imageKey];
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    responseResult.push(users);
                    
                }));

                //ubah bentuk array array object ke array object
                let responseFinal = []
                for(let i = 0; i < responseResult.length; i++) {
                    responseFinal = responseFinal.concat(responseResult[i]);
                }
                return res.send({
                    status: true,
                    message: 'Success!',
                    data: responseFinal
                });
            }
            return res.send({
                status: true,
                message: 'Data point kosong!',
                data: []
            });
        } catch (err) {
            return res.send({
                status: false,
                message: err.message,
                data: []
            })
        }
    }

    async function getImageURL(userAuthCodes, req) {
        try{
            // let imageProfileURL = config.app.url[config.app.env].microservice_images + "/api/v2.0/foto-profile";
            let imageProfileURL = config.app.url[config.app.env].microservice_images + "/api/v2.0/internal/foto-profile/users";
            axios.defaults.headers.common['Authorization'] = req.headers.authorization;
            let result = await axios.post(imageProfileURL, userAuthCodes);
            if (result.data) {
                return result.data.data;
            }
            return null;
        } catch (err) {
            console.log(err);
        }
    }
    async function getUserProfile(userAuthCodes, req) {
        try {
            let contactServiceURL = config.app.url[config.app.env].microservice_auth + "/api/v2.0/internal/contacts";
            axios.defaults.headers.common['Authorization'] = req.headers.authorization;
            let result = await axios.post(contactServiceURL, userAuthCodes);
            return result.data.data;
        } catch (err) {
            console.log(err);
        }
        return null;
    }