var request = require('request');
var http = require('http');


module.exports = function (req, res, next) {
  // default roll is 2d6
  var botPayload = {};
 var term = req.body.text;
    if (!term){
		return "No search string!";
	}
	var options = {
	host:'api.miuinsights.com',
	path:'/contracts/approved.json',
	headers:{authorization:'874ef80d724b44dca70647f19eaf9e09'}
};	
	var out = '';
	var req = http.get(options,function(res){
		 var bodyChunks = [];
		 
		 res.on('data', function(chunk) {
				bodyChunks.push(chunk);
		}).on('end', function() {
			var body = Buffer.concat(bodyChunks);
			var bodyJson = JSON.parse(body);
			outclasses = [];
			for(var i=0; i<bodyJson.length;i++){
				var contract = bodyJson[i];
				if(term.indexOf("id:")==0&&(("id:"+contract.id)==term)){
					outclasses.push(contract);
				}
				if ((contract.programName + ' - ' + contract.className).indexOf(term)>-1){
				outclasses.push(contract);
				}
			}
			if (outclasses.length>1){
				for (var j=0;j<outclasses.length;j++){
					out+= '*' + outclasses[j].id + '*: ' + outclasses[j].programName + ' - ' + outclasses[j].className + "; approved "+outclasses[j].approvedDate+"\n";
				}
				//
				   var error = false;
     if (!error) {
	    
		 botPayload.text = '*' + req.body.text + '*: ' +miu(out);
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
				
				//
				
			}
			else{
			     if (outclasses.length==0){
				 return("Nothing found!");
				 }
				var specificRequest = {
					host:'api.miuinsights.com',
					path:'/contracts/'+outclasses[0].id+'/'+outclasses[0].version+'.json',
					headers:{authorization:'874ef80d724b44dca70647f19eaf9e09'}
				};
				var innerReq = http.get(specificRequest,function(resp){
					 var bodyChunksInner = [];
		 
					resp.on('data', function(chunk) {
							bodyChunksInner.push(chunk);
					}).on('end', function() {

							var bodyIn = Buffer.concat(bodyChunksInner);
							var ctc = JSON.parse(bodyIn);
							out = "*"+ctc.program.name+" - "+ctc.className +"* /n";
							out+= ctc.principal+ctc.principalCurrency + " in force from " + ctc.riskStartDate + " to " + ctc.riskEndDate + "/n";
							for (var k = 0; k<ctc.perilRegions.length; k++){
								out+= ctc.perilRegions[k].peril + ctc.perilRegions[k].region +"/n";
							}
							out+= ctc.createdBy + " made it but " + ctc.approvedBy + " has their neck on the line /n";
							//
				   var error = false;
     if (!error) {
	    
		 botPayload.text = '*' + req.body.text + '*: ' +miu(out);
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
				
				//
					});
		
				});
			}
		});
	});
	
req.on('error', function(e) {
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