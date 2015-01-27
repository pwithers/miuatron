var request = require('request');
var http = require('http');

module.exports = function (req, res, next) {
  var userName = req.body.user_name;
  var botPayload = {
	channel:req.body.channel_id,
	username:'autoboss'
  };
  // get team members 
  var options = {
	host:'https://slack.com/api',
	path:'/users.list',
	headers:{token:'xoxp-3143394713-3453358604-3533236840-f1d822'}
};	

    var request = http.get(options,function(responseIn){
		 var bodyChunks = [];
		 
		 responseIn.on('data', function(chunk) {
				bodyChunks.push(chunk);
		}).on('end', function() {
			var body = Buffer.concat(bodyChunks);
			var bodyJson = JSON.parse(body);
			out = '*Team members* \n';
			for (var j=0;j<bodyJson.length;j++){
					out+= '*' + bodyJson[j].real_name + '*: '+bodyJson[j].profile.title"\n";
			}
			botPayload.text = out;
			send(botPayload, function (error, status, body) {
			 if (error) {
				 return next(error);
			 } else if (status !== 200) {
			 // inform user that our Incoming WebHook failed
			 return next(new Error('Incoming WebHook: ' + status + ' ' + body));
			 } else {
			 return res.status(200).end();
			 }
		 });
		});
  
  
  // avoid infinite loop
  if (userName !== 'slackbot') {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  }
}


function send (payload, callback) {
  var path = process.env.INCOMING_WEBHOOK_PATH;
  var uri = 'https://hooks.slack.com/services' + path;
 
  request({
    uri: uri,
    method: 'POST',
    body: JSON.stringify(payload)
  }, function (error, response, body) {
    if (error) {
      return callback(error);
    }
 
    callback(null, response.statusCode, body);
  });
}