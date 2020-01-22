/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	
    const oracledb = require('oracledb');
    const dateFormat = require('dateformat');
    const Client = require('node-rest-client').Client;

    const client = new Client();
    

/*
 |--------------------------------------------------------------------------
 | Module Exports
 |--------------------------------------------------------------------------
*/
    //function untuk mendapat point current user
    exports.myPoint = async ( req, res ) => {
        let userAuthCode = { USER_AUTH_CODE: "1001" };
        
        try {
            let args = {
                data: userAuthCode ,
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": req.headers.authorization
                }
            }
            let imageProfileURL = config.app.url[config.app.env].microservice_images + "/api/v2.0/foto-profile";
            let request = await client.post(imageProfileURL , args, function (data, response) {
                // parsed response body as js object
                if (data.data) {
                    var response = [];
                    let imageURL = data.data.URL;
                    if (!imageURL) {
                        imageURL = "http://149.129.250.199:4012/files/images-profile/default.png";
                    }
                    response.push({
                        RANK: 5,
                        NAME: 'Rizky Puspitasari',
                        IMAGE_URL: imageURL,
                        POINT: 1250
                    });
                    return res.send({
                        status: true,
                        message: 'success',
                        data: response
                    });
                } else {
                    return res.send({
                        status: false,  
                        message: 'Periksa URL ' + imageProfileURL,
                        data: []
                    });
                }
            });
            
            request.on('requestTimeout', function (req) {
                console.log('request has expired');
                request.abort();
            });
            
            request.on('responseTimeout', function (res) {
                console.log('response has expired');
            });
            
            //it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
            request.on('error', function (err) {
                return res.send({
                    data: false,
                    message: err.message,
                    data: []
                });
            });
        } catch(err) {
            return res.send({
                status: true,
                message: err.message,
                data: []
            });
        }
       
    }

    //function untuk mendapatkan point other user
    exports.userPoint = async ( req, res ) => {
        
    }