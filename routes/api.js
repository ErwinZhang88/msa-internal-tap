/*
 |--------------------------------------------------------------------------
 | Setup
 |--------------------------------------------------------------------------
 */
    //Controllers
    const Controllers = {
        v_1_0: {
            ExportKafka : require( _directory_base + '/app/v1.0/Http/Controllers/ExportKafkaController.js' ),
            Suggestion: require(_directory_base + '/app/v1.0/Http/Controllers/SuggestionController.js'),
            TitikRestan: require(_directory_base + '/app/v1.0/Http/Controllers/TitikRestanController.js'),
            PetaPanen: require(_directory_base + '/app/v1.0/Http/Controllers/PetaPanenController.js')
        }
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
        app.get( '/api/v1.0/push-kafka', Controllers.v_1_0.ExportKafka.pushKafka );
        
        //get data suggestion 
        app.get('/api/v1.0/suggestion', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Suggestion.suggestion);

        //get kg taksasi
        app.get('/api/v1.0/taksasi', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.TitikRestan.taksasi);

        //Untuk get data peta panen header dan detail
        app.get('/api/v1.0/peta-panen/header', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.PetaPanen.petaPanenHeader);
        app.get('/api/v1.0/peta-panen/detail', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.PetaPanen.petaPanenDetail);
    }
