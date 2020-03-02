/*
 |--------------------------------------------------------------------------
 | Setup
 |--------------------------------------------------------------------------
 */
    //Controllers
    const Controllers = {
        v_1_0: {
            ExportKafka : require( _directory_base + '/app/v1.0/controllers/ExportKafkaController.js' ),
            Suggestion: require(_directory_base + '/app/v1.0/controllers/SuggestionController.js'),
            TitikRestan: require(_directory_base + '/app/v1.0/controllers/TitikRestanController.js'),
            PetaPanen: require(_directory_base + '/app/v1.0/controllers/PetaPanenController.js'),
            Point: require(_directory_base + '/app/v1.0/controllers/PointController.js'),
            Master: require(_directory_base + '/app/v1.0/controllers/master/MasterController.js')
        }
    }
    const VerifyToken = require(_directory_base + '/app/utils/VerifyToken.js');
        
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
        app.get('/api/v1.0/suggestion', VerifyToken, Controllers.v_1_0.Suggestion.suggestion);

        //get kg taksasi
        app.get('/api/v1.0/taksasi', VerifyToken, Controllers.v_1_0.TitikRestan.taksasi);

        //get titik restan api
        app.get('/api/v1.0/titik-restan', VerifyToken, Controllers.v_1_0.TitikRestan.titikRestan);

        //Untuk get data peta panen header dan detail
        app.get('/api/v1.0/peta-panen/header', VerifyToken, Controllers.v_1_0.PetaPanen.petaPanenHeader);
        app.get('/api/v1.0/peta-panen/detail', VerifyToken, Controllers.v_1_0.PetaPanen.petaPanenDetail);

        //Untuk get point current user (tidak jadi dipakai, pindah ke msa-point)
        // app.get('/api/v1.0/point/me', VerifyToken, Controllers.v_1_0.Point.myPoint);

        //Untuk get point other user (tidak jadi dipakai, pindah ke msa-point)
        // app.get('/api/v1.0/point/users', VerifyToken, Controllers.v_1_0.Point.userPoint);
        
        //get data master block dan afdeling 2 API ini dipakai oleh project IDMS
        app.get('/api/v1.0/master/block', VerifyToken, Controllers.v_1_0.Master.block);
        app.get('/api/v1.0/master/afdeling', VerifyToken, Controllers.v_1_0.Master.afdeling);

    }
