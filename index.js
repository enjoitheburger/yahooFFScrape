const ff_espn = require('./ff_espn.js');

exports.handler = async (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    //return "hello";  // Echo back the first key value
    // throw new Error('Something went wrong');
    
    const leagueId = event['queryStringParameters']['leagueId']
    const seasonYear = event['queryStringParameters']['seasonYear']
    const x = await ff_espn.calculate(leagueId, seasonYear);

    var response = {
        "statusCode": 200,
        // "headers": {
        //     "my_header": "my_value"
        // },
        "body": JSON.stringify(x),
        "isBase64Encoded": false
    };
    callback(null, response);
};

// local testing
//this.handler({ queryStringParameters: {leagueId: 165105, seasonYear: 2017}}, null, (a,b) => console.log(b));
