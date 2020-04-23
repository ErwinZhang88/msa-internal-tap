/*
|--------------------------------------------------------------------------
| Database Config File
|--------------------------------------------------------------------------
|
*/	
	//require .env
	require('dotenv').config()

	module.exports = {
		dev: {
			mobileInspection: {
				user          : process.env.DB_USER_MI, 
				password      : process.env.DB_PASSWORD_MI,
				connectString : process.env.DB_URL_DEV
			},
			patroliApi: {
				user          : process.env.DB_USER_PATROLI,
				password      : process.env.DB_PASSWORD_PATROLI, 
				connectString : process.env.DB_URL_DEV
			},
		},
		qa: {
			user          : process.env.NODE_ORACLEDB_USER || "mobile_inspection",
			password      : process.env.NODE_ORACLEDB_PASSWORD || "mobile_inspection",
			connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "10.20.1.111:1521/tapapps"
		},
		prod: {
			user          : process.env.NODE_ORACLEDB_USER || "mobile_inspection",
			password      : process.env.NODE_ORACLEDB_PASSWORD || "mobile_inspection",
			connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "10.20.1.207:1521/tapapps"
		}
	};



