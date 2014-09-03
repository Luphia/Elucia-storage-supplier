module.exports = {
    init: function() 
    {
        return this;
    }
 
    ,   send: function(_server_ip, _client_id, _type, _content, _publicIP)
    {
		// require("../modules/log2Server.js").send(ServerIP, client_id, "Err", content);
 
		var supplier_ip;
		var addresses = [];
		
		var os = require('os');
		var interfaces = os.networkInterfaces();		
		for (k in interfaces) {
			for (k2 in interfaces[k]) {
				var address = interfaces[k][k2];
				if (address.family == 'IPv4' && !address.internal) {
					addresses.push(address.address);
				}
			}
		}
		
		supplier_ip = addresses[0];
		
		var getRes = function(data){
			//console.log("Send log OK");
		}
		
		// type ¼Æ¦r
		var params = {
			"clientId": _client_id,
			"type": _type,
			"content": _content,					
		};
		var post = require( '../commands/postURL.js' );
		try{
			var actions = {
				"action": "log2Server",
				"publicIP": _publicIP
			};

			post.posturl(actions, "", _server_ip, params, getRes);
		}catch(e){
			_callBack(e);
		}

    }
 
};