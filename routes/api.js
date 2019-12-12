/*
 |--------------------------------------------------------------------------
 | Setup
 |--------------------------------------------------------------------------
 */
    //Controllers
    const Controller = {
        ExportKafka : require( _directory_base + '/app/v1.0/Http/Controllers/ExportKafkaController.js' )
    }
    module.exports = ( app ) => {

        /*
        |--------------------------------------------------------------------------
        | Welcome Message
        |--------------------------------------------------------------------------
        */
            app.get( '/', ( req, res ) => {
                return res.json( { 
                    application: {
                        name : 'Microservice Internal TAP',
                        env : config.app.env,
                        port : config.app.port[config.app.env]
                    } 
                } )
            } );
            
        /*
        |--------------------------------------------------------------------------
        | Versi 1.0
        |--------------------------------------------------------------------------
        */
        app.get( '/api/v1.0/push-kafka', Controller.ExportKafka.pushKafka );
    }