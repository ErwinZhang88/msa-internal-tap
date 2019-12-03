/*
 |--------------------------------------------------------------------------
 | Database Connections
 |--------------------------------------------------------------------------
 |
 | Here are each of the database connections setup for your application.
 | Of course, examples of configuring each database platform that is
 | supported by NodeJS is shown below to make development simple.
 |
 */
	module.exports = {
		/*
		|--------------------------------------------------------------------------
		| Database Connections
		|--------------------------------------------------------------------------
		|
		| Here are each of the database connections setup for your application.
		| Of course, examples of configuring each database platform that is
		| supported by Laravel is shown below to make development simple.
		|
		|
		| All database work in Laravel is done through the PHP PDO facilities
		| so make sure you have the driver for your particular database of
		| choice installed on your machine before you begin development.
		|
		*/
			tapdw: {
				user : process.env.NODE_ORACLEDB_USER || "TAP_DW",
				password : process.env.NODE_ORACLEDB_PASSWORD || "tapdw123#",
				connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "10.20.1.103:1521/tapdw"
			},

			mobile_inspection_qa: {
				user : process.env.NODE_ORACLEDB_USER || "MOBILE_INSPECTION",
				password : process.env.NODE_ORACLEDB_PASSWORD || "mobile_inspection",
				connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "10.20.1.111:1521/tapapps"
			}
	}