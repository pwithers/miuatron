var request = require('request');

module.exports = function (req, res, next) {
  // default roll is 2d6
  var botPayload = {};
   var error = false;
    if (!error) {
		botPayload.text = '@' + req.body.user_name + ':*' +miu(req.body.text) + '*';
		botPayload.channel = req.body.channel_id;
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
    } else {
      // send error message back to user if input is bad
      return res.status(200).send('No term found');
    }
}
 
function miu (term) {
	return 'searched for'+term;
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