/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
    const OracleDB = require('oracledb');
    // Primary Variable
    const Helper = require(_directory_base + '/app/utils/Helper.js');
    const Client = require( 'node-rest-client' ).Client;
    const client = new Client();
    const dateFormat = require('dateformat');

    exports.suggestion = async (req, res) => {
        let auth = req.auth;
        let responseForMobile = [];
        const REFFERENCE_ROLE = auth.REFFERENCE_ROLE;
		const USER_AUTH_CODE = auth.USER_AUTH_CODE;
		let LOCATION_CODE = auth.LOCATION_CODE;
		    LOCATION_CODE = LOCATION_CODE.split(',');
            LOCATION_CODE = LOCATION_CODE.map(LOCATION => `'${LOCATION}'`).join(',');
        let whereCondition = ` AND USER_AUTH_CODE = '${USER_AUTH_CODE}' `;

        switch (auth.REFFERENCE_ROLE) {
            case 'NATIONAL':
				whereCondition += "";
			break;
			case 'COMP_CODE':
				whereCondition += `AND SH.\"Company Code\" IN( ${LOCATION_CODE} )`;
			break;
			case 'BA_CODE':
				whereCondition += `AND SD.WERKS IN( ${LOCATION_CODE} )`;
			break;
			case 'AFD_CODE':
				whereCondition += `AND SD.WERKS || SD.AFD_CODE IN( ${LOCATION_CODE} )`;
			break;
			case 'AFD_CODE':
				whereCondition += `AND SD.WERKS || SD.AFD_CODE || SD.BLOCK_CODE IN( ${LOCATION_CODE} )`;
			break;
        }
        console.log(whereCondition);
        try {
            let sql, binds, options, result;
            let arrayGetImageByTRCode = {};
            connection = await OracleDB.getConnection( config.database );
            sql =  `
                SELECT
                    SD.BLOCK_NAME || ' / ' || SH.\"Maturity Status\" || ' / ' || SH.\"Estate Name\" AS LOCATION_CODE,
                    SH.LAST_TGL_PANEN,
                    SH.LAST_TGL_INSPEKSI,
                    SD.INS_DATE1,
                    SD.INS_ROLE1,
                    SD.INS_BARIS1,
                    SD.INS_DATE2,
                    SD.INS_ROLE2,
                    SD.INS_BARIS2,
                    SD.INS_DATE3,
                    SD.INS_ROLE3,
                    SD.INS_BARIS3,
                    SD.INS_DATE4,
                    SD.INS_ROLE4,
                    SD.INS_BARIS4,
                    SD.PAN_DATE,
                    SD.PAN_TOTAL_JJG,
                    SD.PAN_BJR_LALU,
                    SD.PAN_RES_TPH,
                    SD.RAW_DATE,
                    SD.RAW_CPT_DATE,
                    SD.RAW_CPT_HK,
                    SD.RAW_CPT_HA,
                    SD.RAW_SPOT_DATE,
                    SD.RAW_SPOT_HK,
                    SD.RAW_SPOT_HA,
                    SD.RAW_LALANG_DATE,
                    SD.RAW_LALANG_HK,
                    SD.RAW_LALANG_HA,
                    SD.WERKS,
                    SD.AFD_CODE,
                    SD.BLOCK_CODE,
                    SD.BLOCK_NAME
                FROM
                    TR_SUGGESTION_H SH
                    LEFT JOIN TR_SUGGESTION_D SD
                        ON SH.\"Kode BA\" = SD.WERKS
                        AND SH.AFD = SD.AFD_CODE
                        AND SH.\"Block Code\" = SD.BLOCK_CODE
                WHERE 
                    1 = 1
                    ${whereCondition}
                    AND rank_no < 6
                    AND rownum < 6
                ORDER BY rank_no
            `;
            binds = {};
            options = {
                outFormat: OracleDB.OUT_FORMAT_OBJECT
                // extendedMetaData: true,
                // fetchArraySize: 100
            };
            result = await connection.execute( sql, binds, options );
            let index = 0;
            await Promise.all( result.rows.map(async function (rs) {
                ++index;
                let werksAfdBlockCode = rs.WERKS + rs.AFD_CODE + rs.BLOCK_CODE;
                let resultSqlStatement, bindsSqlStatement, optionsSqlStatement;
                let sqlStatement = `
				SELECT
					LISTAGG( BLOCK_INSPECTION_CODE, ', ') WITHIN GROUP ( ORDER BY BLOCK_INSPECTION_CODE ) AS TR_CODE
				FROM
					TR_BLOCK_INSPECTION_H
				WHERE
					ROWNUM < 10
					AND WERKS || AFD_CODE || BLOCK_CODE = '${werksAfdBlockCode}'
                `;
                bindsSqlStatement = {};
                optionsSqlStatement = {
                    outFormat: OracleDB.OUT_FORMAT_OBJECT
                };
                resultSqlStatement = await connection.execute(sqlStatement, bindsSqlStatement, optionsSqlStatement);
                let arrayTRCode = (resultSqlStatement.rows[0].TR_CODE == null ? [] : resultSqlStatement.rows[0].TR_CODE.split( ',' ) );
                arrayGetImageByTRCode[werksAfdBlockCode] = arrayTRCode;
            }));
            let args = {
                data: arrayGetImageByTRCode,
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": req.headers.authorization
                }
            }
            let serviceImage = config.app.url[config.app.env].microservice_images;
            let request = client.post( serviceImage + '/api/v2.0/inspection/suggestion', args, function ( data, response ) {
                if (data) {
                    result.rows.forEach(function (rs) {
                        let werksAfdBlockCode = rs.WERKS + rs.AFD_CODE + rs.BLOCK_CODE;
                        let imageUrl = data.data[werksAfdBlockCode];
                        let imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
                        
                        let dataArray = [];
                        let dt = [];

                        dt.push({
                            TOTAL_JANJANG_PANEN: parseInt(rs.PAN_TOTAL_JJG),
                            BJR_BULAN_LALU: rs.PAN_BJR_LALU ? parseInt(rs.PAN_BJR_LALU): 0,
                            TOTAL_RESTAN_TPH: rs.PAN_RES_TPH ? parseInt(rs.PAN_RES_TPH) : 0
                        });

                        let cptDesc = ( rs.RAW_CPT_DATE != null ? dateFormat(rs.RAW_CPT_DATE, "d mmm yyyy") : '-' ) + 
                                        ', ' + (rs.RAW_CPT_HA != null ? Math.round(rs.RAW_CPT_HA * 100) / 100: '-') + ' Ha, ' +
                                        (rs.RAW_CPT_HK != null ? Math.round(rs.RAW_CPT_HK * 100) / 100 : '-') + 'HK';
                        let spotDesc = ( rs.RAW_SPOT_DATE != null ? dateFormat(rs.RAW_SPOT_DATE, "d mmm yyyy") : '-' ) + 
                                        ', ' + (rs.RAW_SPOT_HA != null ? Math.round(rs.RAW_SPOT_HA * 100) / 100: '-') + ' Ha, ' +
                                        (rs.RAW_SPOT_HK != null ? Math.round(rs.RAW_SPOT_HK * 100) / 100 : '-') + 'HK';
                        let lalangDesc = ( rs.RAW_LALANG_DATE != null ? dateFormat(rs.RAW_LALANG_DATE, "d mmm yyyy") : '-' ) + 
                                        ', ' + (rs.RAW_LALANG_HA != null ? Math.round(rs.RAW_LALANG_HA * 100) / 100: '-') + ' Ha, ' +
                                        (rs.RAW_LALANG_HK != null ? Math.round(rs.RAW_LALANG_HK * 100) / 100 : '-') + 'HK';
                        dataArray.push({
                            TYPE:'rawat',
                            DATE: dateFormat(rs.RAW_DATE, 'yyyy-mm-dd 00:00:00'),
                            DESC: 'Rawat',
                            DATA: {
                                CPT_SPRAYING: cptDesc,
                                SPOT_SPRAYING: spotDesc,
                                LALANG_CTRL: lalangDesc
                            }
                        });
                        dataArray.push({
                            TYPE:'panen',
                            DATE: dateFormat(rs.PAN_DATE, 'yyyy-mm-dd 00:00:00'),
                            DESC: 'Panen',
                            DATA: dt
                        });

                        let sortingData = [];
                        sortingData.push({
                            INS_DATE: rs.INS_DATE1,
                            INS_ROLE: rs.INS_ROLE1.replace('_', ' '),
                            INS_BARIS: rs.INS_BARIS1
                        });
                        sortingData.push({
                            INS_DATE: rs.INS_DATE2,
                            INS_ROLE: rs.INS_ROLE2.replace('_', ' '),
                            INS_BARIS: rs.INS_BARIS2
                        });
                        sortingData.push({
                            INS_DATE: rs.INS_DATE3,
                            INS_ROLE: rs.INS_ROLE3.replace('_', ' '),
                            INS_BARIS: rs.INS_BARIS3
                        });
                        sortingData.push({
                            INS_DATE: rs.INS_DATE4,
                            INS_ROLE: rs.INS_ROLE4.replace('_', ' '),
                            INS_BARIS: rs.INS_BARIS4
                        });

                        let n = 31;
                        sortingData.forEach(function (sd) {
                            if (sd.INS_DATE == null) {
                                sd.INS_DATE = dateFormat('9999-12-' + n, 'yyyy-mm-dd 00:00:00');
                                n--;
                            }
                        });

                        sortingData.sort((a,b) => (a.INS_DATE > b.INS_DATE) ? 1 : ((b.INS_DATE > a.INS_DATE) ? -1 : 0)); 
                        let dataTipeInspeksi = [];
                        for (let i = 1; i <= 3; i++) {
                            dataTipeInspeksi.push({
                                ROLE: sortingData[i].INS_ROLE,
                                DATE_ROLE: (sortingData[i].INS_DATE != null ? dateFormat(sortingData[i].INS_DATE, 'yyyy-mm-dd 00:00:00') : ''),
                                BARIS: sortingData[i].INS_BARIS
                            });
                        }

                        dataArray.push({
                            TYPE:'inspeksi',
                            DATE: (sortingData[0].INS_DATE != null ? dateFormat(sortingData[0].INS_DATE, 'yyyy-mm-dd 00:00:00') : ''),
                            DESC: sortingData[0].INS_ROLE,
                            BARIS: sortingData[0].INS_BARIS,
                            DATA: dataTipeInspeksi
                        });
                        responseForMobile.push({
                            LOCATION_CODE: rs.LOCATION_CODE,
                            WERKS: rs.WERKS,
                            DESC: '',
                            AFD_CODE: rs.AFD_CODE,
                            BLOCK_CODE: rs.BLOCK_CODE,
                            BLOCK_NAME: rs.BLOCK_NAME,
                            IMAGE: imageUrl,
                            IMAGE_NAME: imageName,
                            DATA_ARRAY: dataArray
                        });
                        // console.log(rs);
                    });
                    res.send({
                        status: true,
                        message: 'OK',
                        data: responseForMobile
                    })
                }
            } );
           
            request.on( 'error', ( err ) => {
                console.log( `FINDING ${err.message}` );
                return res.send({
                    status: false,
                    message: 'Periksa Microservice Image',
                    data: []
                });
            } );
        } catch (error) {
            res.send({
                status: false,
                message: 'Internal Server Error',
                data:[]
            });
        }
        
    }