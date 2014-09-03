
module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},

	// ¿À¨d VM
	execute = function(_data, _callBack){
		console.log("####### in function getNodeFileList ######## ");
	
		// get fileList info
		//var url = "http://" + _data._config.serverIP + ":3000/";
		var url = "http://" + _data._config.serverIP + ":" + _data._config.communicationPort + "/";
		var file_path = "node/fileList";
		var request = require('request-json');
		var client = request.newClient(url);
		
		client.get(file_path, function(err, res, body) {
			//return console.log(body.rows[0].title);
			if(err){
				console.log("get " + url + file_path + " err");
				_callBack(false, job);
			}else{
				//console.slog(body);
				console.log("http post: " + url + file_path);
				var result = JSON.parse(res.body);
				_data.fileList = result;
								
				//console.log(_data.fileList);
				
				_callBack(false, job);	
			}
		});		
		
	},
	
	
	that = {
		init: init,
		execute: execute
	};
	return that;		
}	
	