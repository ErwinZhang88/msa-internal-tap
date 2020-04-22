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
		/*async consumer () {
			const Consumer = kafka.Consumer;
			const Offset = kafka.Offset;
			const Client = kafka.KafkaClient;
			const client = new Client({ kafkaHost: config.app.kafka[config.app.env].server_host });
			
			let offsets = await this.getListOffset();
			const topics = [
				{ topic: 'PAT_MSA_PATROLI_TR_TRACKING', partition: 0, offset: 0/*offsets['PAT_MSA_PATROLI_TR_TRACKING'] }
			];
			const options = {
				autoCommit: false,
				fetchMaxWaitMs: 1000,
				fetchMaxBytes: 1024 * 1024,
				fromOffset: true,
				requestTimeout: 5000
			};

			const consumer = new Consumer(client, topics, options);
			let offset = new Offset(client);
			consumer.on( 'message', async ( message ) => {
				if (message) {
					if (message.topic && message.value) {
						try {
							this.save(message, offset);
						} catch (err) {
							console.log(err);
						}
					}
				}
			})
			consumer.on( 'error', function( err ) {
				console.log( 'error', err );
			});
			consumer.on('offsetOutOfRange', function (topic) {
				topic.maxNum = 2;
				offset.fetch([topic], function (err, offsets) {
					if (err) {
						return console.error(err);
					}
					var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
					consumer.setOffset(topic.topic, topic.partition, min);
				});
			});
			
		}*/
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
			  var consumerGroup = new ConsumerGroup(options, ['PAT_MSA_PATROLI_TR_TRACKING']);
  
			  consumerGroup.on('message', function (message) {
				console.log(message);
				//TODO: You can write your code or call messageProcesser function
			  });
			
			  consumerGroup.on('error', function onError(error) {
				console.error(error);
			  });
		}
		async save(message, offsetFetch) {
			try {
				this.updateOffset(message.topic, offsetFetch)
			} catch (err) {
				console.log(err);
			}
		}

		//untuk mendapatkan semua offset dari setiap topic
		async getListOffset() {
			try {
				
			} catch (err) {
				
			}
		}
		
		//update offset dari satu topic
		updateOffset(topic, offsetFetch) {
			try {
				offsetFetch.fetch([
					{ topic: topic, partition: 0, time: -1, maxNum: 1 }
				], async function (err, data) {
					let lastOffsetNumber = data[topic]['0'][0];
					let sql, binds, options, result;
					console.log(topic);
					console.log(lastOffsetNumber);
					sql = `UPDATE PATROLI.T_KAFKA_PAYLOADS SET OFFSET= :offset WHERE TOPIC= :topic`
					try {
						let connection = await oracledb.getConnection( patroliDBConfig );
						binds = {};
						options = {
							autoCommit: true
						};
						await connection.execute( sql, {topic: topic, offset: lastOffsetNumber}, options);
						console.log("sukses update offset")
					} catch (err) {
						console.log(err)
					}
				});
			} catch (err) {
				console.log(err);
			}
		}
	}


/*
|--------------------------------------------------------------------------
| Module Exports
|--------------------------------------------------------------------------
*/
	module.exports = new Kafka();