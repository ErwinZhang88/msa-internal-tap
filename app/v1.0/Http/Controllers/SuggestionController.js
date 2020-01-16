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
    const Helper = require(_directory_base + '/app/v1.0/Http/Libraries/Helper.js');
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
            // LOCATION_CODE = '\''.join( '\',\'' + LOCATION_CODE ) + '\'';
            // LOCATION_CODE = LOCATION_CODE.join(',');
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
        try {
            let sql, binds, options, result;
            let arrayGetImageByTRCode = {};
            connection = await OracleDB.getConnection( config.database );
            sql = ( `
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
            ` );
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
                let arrayTRCode = (resultSqlStatement.rows[0] == '' ? [] : resultSqlStatement.rows[0].TR_CODE.split( ',' ) );
                
                arrayGetImageByTRCode[werksAfdBlockCode] = arrayTRCode;
            }));
            let args = {
                data: arrayGetImageByTRCode,
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": req.headers.authorization
                }
            }
            let request = client.post( 'http://149.129.250.199:4012/api/v2.0/inspection/suggestion', args, function ( data, response ) {
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
                                        ', ' + (rs.RAW_CPT_HA != null ? rs.RAW_CPT_HA: '-') + ' Ha, ' +
                                        (rs.RAW_CPT_HK != null ? rs.RAW_CPT_HK : '-') + 'HK';
                        let spotDesc = ( rs.RAW_SPOT_DATE != null ? dateFormat(rs.RAW_SPOT_DATE, "d mmm yyyy") : '-' ) + 
                                        ', ' + (rs.RAW_SPOT_HA != null ? rs.RAW_SPOT_HA: '-') + ' Ha, ' +
                                        (rs.RAW_SPOT_HK != null ? rs.RAW_SPOT_HK : '-') + 'HK';
                        let lalangDesc = ( rs.RAW_LALANG_DATE != null ? dateFormat(rs.RAW_LALANG_DATE, "d mmm yyyy") : '-' ) + 
                                        ', ' + (rs.RAW_LALANG_HA != null ? rs.RAW_LALANG_HA: '-') + ' Ha, ' +
                                        (rs.RAW_LALANG_HK != null ? rs.RAW_LALANG_HK : '-') + 'HK';
                        dataArray.push({
                            TYPE:'rawat',
                            DATE: Helper.date_format(rs.RAW_DATE, 'YYYY-MM-DD hh:mm:ss'),
                            DESC: 'Rawat',
                            DATA: {
                                CPT_SPRAYING: cptDesc,
                                SPOT_DESC: spotDesc,
                                LALANG_CTRL: lalangDesc
                            }
                        });
                        dataArray.push({
                            TYPE:'panen',
                            DATE: Helper.date_format(rs.PAN_DATE, 'YYYY-MM-DD hh:mm:ss'),
                            DESC: 'Panen',
                            DATA: dt
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
                            DATA: dataArray
                        });
                        // console.log(rs);
                    });
                    res.send({
                        status: true,
                        message: 'success',
                        data: responseForMobile
                    })
                }
            } );
           
            request.on( 'error', ( err ) => {
                console.log( `FINDING ${err.message}` );
            } );
        } catch (error) {
            console.log(error);
        }
        
    }