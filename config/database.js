module.exports = {
	dev: {
		user          : process.env.NODE_ORACLEDB_USER || "mobile_inspection",
		password      : process.env.NODE_ORACLEDB_PASSWORD || "mobile_inspection",
		connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "10.20.1.111:1521/tapapps"
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



