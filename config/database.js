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
			mobileInspection: {
				user          : process.env.DB_USER_MI, 
				password      : process.env.DB_PASSWORD_MI,
				connectString : process.env.DB_URL_QA
			},
			patroliApi: {
				user          : process.env.DB_USER_PATROLI,
				password      : process.env.DB_PASSWORD_PATROLI, 
				connectString : process.env.DB_URL_QA
			},
		},
		prod: {
			mobileInspection: {
				user          : process.env.DB_USER_MI, 
				password      : process.env.DB_PASSWORD_MI,
				connectString : process.env.DB_URL_PROD
			},
			patroliApi: {
				user          : process.env.DB_USER_PATROLI,
				password      : process.env.DB_PASSWORD_PATROLI, 
				connectString : process.env.DB_URL_PROD
			}
		}
	};



