
module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},

	// AE?d VM
	execute = function(_data, _callBack){
		console.log("####### in function sendHeartBeat ######## ");
		var serverIP = _data._config.serverIP;
		var clientID = _data.clientID;
		// _callBack
		var getRes = function(data) {
			// if(typeof(data) != "undefined"){
			
				// var res = JSON.parse(data);
				// if(res.result == 1){
					// // post registration info to Center
					// var getRegister = function(data) {
						// _callBack(false,job);
					// }
					// //console.log(_data._config);
					// var params = {
						// "name":_data._config.companyName,
						// "contact":_data._config.companyContact,
						// "totalSpace":_data._config.regitserDiskSpace,
						// "upload_speed_limit":_data._config.upload_speed_limit,
						// "download_speed_limit":_data._config.download_speed_limit,
						// "port":_data._config.communicationPort,
						// "bandwith": Math.random() * 512 + 10,	// 取得本機頻寬
						// "machineUId":_data._config.machineUID						
					// };
					// var post = require( './postURL.js' );
					// try{
						// post.posturl("sendRegisteration", "", serverIP, params, getRegister);
					// }catch(e){
						// _callBack(e);
					// }		
				// }
				
				// _callBack(false,job);	
			// }else{
				// _callBack(false,job);
			// }
			
			_callBack(false,job);
		}	
		
		var monitor_data = {
			"cpu": {
				"loading": parseFloat(_data["_result"]["data"]["cpu"])
			},
			"ram": {
				"total": parseInt(_data["_result"]["data"]["totalmem"]),
				"free": parseInt(_data["_result"]["data"]["freemem"]),
				"loading": parseInt(_data["_result"]["data"]["usagemem"])
			},
			"disk": {
				"total": parseInt(_data["_result"]["data"]["total_disk"]),
				"free": parseInt(_data["_result"]["data"]["total_disk"]) - parseInt(_data["_result"]["data"]["used_space"]),
				"loading": parseInt(_data["_result"]["data"]["used_space"])
			},	
			"network": {
				"rx": parseInt(_data["_result"]["data"]["rx_bytes"]),
				"tx": parseInt(_data["_result"]["data"]["tx_bytes"])
			},
			"sessions": {
				"amount": _data["_result"]["data"]["sessions"]
			}
		};
		
		
		//console.log(monitor_data);
				
		// post to Center
		var params = monitor_data;
		var post = require( './postURL.js' );
		try{
			var actions = {
				"action": "sendHeartBeat",
				"publicIP": _data._config.publicIP
			};
			// heartbeat with no clientid
			var sendIP = _data._config.serverIP + ":" + _data._config.communicationPort;
			post.posturl(actions, "", sendIP, params, getRes);
		}catch(e){
			var sendIP = _data._config.serverIP + ":" + _data._config.communicationPort;
			require("../modules/log2Server.js").send(sendIP, 0, 2, "[sendHeartBeat] send heartbeat from supplier ...", _data._config.publicIP);
			_callBack(e);
		}			

	
			
	},
	
	
	that = {
		init: init,
		execute: execute
	};
	return that;		
}	
	