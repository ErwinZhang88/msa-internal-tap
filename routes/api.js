/*
 |--------------------------------------------------------------------------
 | Setup
 |--------------------------------------------------------------------------
 */
    //Controllers
    const Controller = {
        ExportKafka : require( _directory_base + '/app/v1.0/Http/Controllers/ExportKafkaController.js' ),
        Suggestion: require(_directory_base + '/app/v1.0/Http/Controllers/SuggestionController.js')
    }
    const Middleware = {
        v_1_0: {
            VerifyToken: require(_directory_base + '/app/v1.0/Http/Middleware/VerifyToken.js')
        }
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
       //push data titik restan ke kafka
        app.get( '/api/v1.0/push-kafka', Controller.ExportKafka.pushKafka );
        
        //get data suggestion 
        app.get('/api/v1.0/suggestion', Middleware.v_1_0.VerifyToken, Controller.Suggestion.suggestion);
    }
