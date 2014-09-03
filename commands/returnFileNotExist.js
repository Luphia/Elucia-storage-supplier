
module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},

	// ¿À¨d VM
	execute = function(_data, _callBack){
		console.log("####### in function returnFileNotExist ######## ");
		if(typeof(_data.fileList[0]) == "undefined"){
			_callBack(false,job);
			return;
		}		
		// get not exist item
		var notExistFileList = [];		
		for (var key in _data.fileList){
			//console.log(_data.fileList[63]);
			if(typeof(_data.fileList[key]) != "undefined"){
				//console.log(_data.fileList[key].path);
				if(_data.fileList[key].isExistFlag == 0){					
					// console.log(" OKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOK :" + _data.fileList[key].client);
					// console.log(_data.fileList[key].path);
					var tmp_arr = {
						client:_data.fileList[key].client,
						url:_data.fileList[key].url,
						node:_data.fileList[key].node,
						path:_data.fileList[key].path,
					};
					
					notExistFileList.push(tmp_arr);
				}
			}
		}
		
		console.log(notExistFileList);	
		_callBack(false, job);
		
		// post file	
		var postData = function(data) {
			_callBack(false, job);		
			//console.log(data);
		}	
		
		var params = notExistFileList;
		
		// post to Center
		var post = require( './postURL.js' );
		try{
			var sendIP = _data._config.serverIP + ":" + _data._config.communicationPort;
			var actions = {
				"action": "returnFileNotExist",
				"publicIP": _data._config.publicIP
			};
			post.posturl(actions, "", sendIP, params, postData);
		}catch(e){
			callBack(e);
		}			
		
	
	},
	
	
	that = {
		init: init,
		execute: execute
	};
	return that;		
}	
	