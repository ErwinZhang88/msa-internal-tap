/*
|--------------------------------------------------------------------------
| Variable
|--------------------------------------------------------------------------
*/
	const kafka = require( 'kafka-node' );
	const dateformat = require('dateformat');
	const moment = require( 'moment-timezone');
	const oracledb = require( 'oracledb');

	//Models
	// const Models = {
	// 	Point: require( _directory_base + '/app/models/Point.js')
	// }
	/*
|--------------------------------------------------------------------------
| Kafka Server Library
|--------------------------------------------------------------------------
|
| Apache Kafka is an open-source stream-processing software platform 
| developed by LinkedIn and donated to the Apache Software Foundation, 
| written in Scala and Java. The project aims to provide a unified, 
| high-throughput, low-latency platform for handling real-time data feeds.
|
*/
	class Kafka {
		async consumer() {
			const ConsumerGroup = kafka.ConsumerGroup;
			var options = {
				// connect directly to kafka broker (instantiates a KafkaClient)
				kafkaHost: config.app.kafka[config.app.env].server_host,
				groupId: "PATROLI_API_GROUP",
				autoCommit: true,
				autoCommitIntervalMs: 5000,
				sessionTimeout: 15000,
				fetchMaxBytes: 10 * 1024 * 1024, // 10 MB
				// An array of partition assignment protocols ordered by preference. 'roundrobin' or 'range' string for
				// built ins (see below to pass in custom assignment protocol)
				protocol: ['roundrobin'],
				// Offsets to use for new groups other options could be 'earliest' or 'none'
				// (none will emit an error if no offsets were saved) equivalent to Java client's auto.offset.reset
				fromOffset: 'latest',
				// how to recover from OutOfRangeOffset error (where save offset is past server retention)
				// accepts same value as fromOffset
				outOfRangeOffset: 'earliest'
			};
			let consumerGroup = new ConsumerGroup(options, ['PAT_MSA_PATROLI_TR_TRACKING', 'PAT_MSA_PATROLI_TM_USER']);

			consumerGroup.on('message', async (message) => {
				try {
					if (message) {
						if (message.topic == 'PAT_MSA_PATROLI_TR_TRACKING') {
							this.saveTracking(message);
						} else if (message.topic == 'PAT_MSA_PATROLI_TM_USER') {
							this.saveUser(message);
						}
					}
				} catch(err) {
					console.log(err)
				}
			});
		
			consumerGroup.on('error', function onError(error) {
				console.error(error);
			});
		}
		async saveTracking(message) {
			if (message.value) {
				let sql, binds, options, connection;
				
				try {
					let data = JSON.parse(message.value)
					let trackCode = data.TRCD
					let baCode = data.BACD
					let jalur = data.JLR
					let checkpoint = data.CHKPNT
					let duration = parseInt(data.DRTN)
					let jarak = parseFloat(data.JRK).toFixed(2)
					let jmlTitikApi = parseInt(data.JMLTKAP)
					let dateTrack = new Date(data.DTTR)
					let latTrack = data.LAT
					let longTrack = data.LOT
					let syncTime = new Date(data.SYTM)
					let insertUser = data.INSU
					let insertTime = new Date(data.INSTM)

					sql = `INSERT INTO PATROLI_API.TR_TRACKING VALUES(:TRACK_CODE, :BA_CODE, :JALUR, :CHECKPOINT, :DURATION, :JARAK, :JUMLAH_TITIK_API, :DATE_TRACK, :LAT_TRACK, :LONG_TRACK, :SYNC_TIME, :INSERT_USER, :INSERT_TIME)`

					connection = await oracledb.getConnection( patroliDBConfig );
					binds = {
						TRACK_CODE: trackCode,
						BA_CODE: baCode,
						JALUR: jalur,
						CHECKPOINT: checkpoint,
						DURATION: duration,
						JARAK: jarak,
						JUMLAH_TITIK_API: jmlTitikApi,
						DATE_TRACK: dateTrack,
						LAT_TRACK: latTrack,
						LONG_TRACK: longTrack,
						SYNC_TIME: syncTime,
						INSERT_USER: insertUser,
						INSERT_TIME: insertTime
					};
					options = {
						autoCommit: true
					};
					await connection.execute( sql, binds, options);
					console.log("sukses insert data")
				} catch (err) {
					console.log(err);
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
		}
		async saveUser(message) {
			if (message.value) {
				let sql, binds, options, connection;
				
				try {
					let data = JSON.parse(message.value)
					let email = data.EML;
					let fullname = data.FN;

					sql = `INSERT INTO PATROLI_API.TM_USER VALUES(:EMPLOYEE_EMAIL, :EMPLOYEE_FULLNAME)`

					connection = await oracledb.getConnection( patroliDBConfig );

					binds = {
						EMPLOYEE_EMAIL: email,
						EMPLOYEE_FULLNAME: fullname,
					}
					options = {
						autoCommit: true
					};
					await connection.execute( sql, binds, options);
				} catch (err) {
					console.log(err)
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
		}
	}


/*
|--------------------------------------------------------------------------
| Module Exports
|--------------------------------------------------------------------------
*/
	module.exports = new Kafka();