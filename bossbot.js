var request = require('request');
var https = require('https');

module.exports = function (req, res, next) {
  var userName = req.body.user_name;
  var botPayload = {
	channel:req.body.channel_id,
	username:'autoboss'
  };
  // get team members 
    var request = https.get('https://slack.com/api/users.list?token=xoxp-3143394713-3453358604-3533236840-f1d822',
		function(responseIn){
		 var bodyChunks = [];
		 
		 responseIn.on('data', function(chunk) {
				bodyChunks.push(chunk);
		}).on('end', function() {
			var body = Buffer.concat(bodyChunks);
			var bodyJson = JSON.parse(body);
			console.log(bodyJson);
			out = '*Team members* \n';
			for (var j=0;j<bodyJson.members.length;j++){
					out+= '*' + bodyJson.members[j].real_name + '*: '+bodyJson.members[j].profile.title + "\n";
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
		
		});
			
request.on('error', function(e) {
  console.log('ERROR: ' + e.message);
});
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