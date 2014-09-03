
module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},

	// 檢查 VM
	execute = function(_data, callBack){
		console.log("####### in function execUpload ######## ");
		var serverIP = _data._config.serverIP;
		var clientID = _data.client_id;
		//console.log(_data.checkResult);
		//_data.checkResult = 1;

		// check token
		if(_data.checkResult == 0){
			_data.uploadResult = 0;
			callBack(false, job);
			return;
		}

		// check hw limit
		if(_data.checkHWLimit == 0){
			callBack(false, job);
			return;
		}	
		
		//console.log(_data);
				
		// 上傳檔案		
		file_info = _data.file_info; // 取檔案資料
				
		var postFile = _data.file_info;
		var postFileInfo;
		var writePath;
		
		// if(typeof(postFile.file) == "undefined"){
			// writePath = _data.client_id + "/" + postFile[_data.partition_file_name].name;
			// postFileInfo = postFile[_data.partition_file_name];
		// }else{
			// writePath = _data.client_id + "/" + postFile.file.name;
			// postFileInfo = postFile.file;
		// }
		
		writePath = _data.client_id + "/" + _data.partition_file_path;
		postFileInfo = postFile[_data.partition_file_name];
		
		console.log(writePath);
		console.log(_data._config.uploadPath);


		// get file md5 first
		var getMD5 = function(flag,data) {
			_data.file_md5 = data;
			postFileInfo.upload_speed_limit = _data._config.upload_speed_limit;

			// upload files
			try{
				var os = require("os");
				var sendIP = _data._config.serverIP + ":" + _data._config.communicationPort;
				require("../modules/log2Server.js").send(sendIP, _data.client_id, 3, "[execUpload] exec upload file: Server dispatch file(" + _data.partition_file_path  + ") to supplier(" + os.hostname() + ")", _data._config.publicIP);
				require("../modules/file.js").init(_data._config.uploadPath).upload(postFileInfo, writePath);
				_data.uploadResult = 1;
				callBack(false, job);
			}
			catch(e){
				var sendIP = _data._config.serverIP + ":" + _data._config.communicationPort;
				require("../modules/log2Server.js").send(sendIP, _data.client_id, 2, "[execUpload] exec upload err", _data._config.publicIP);
				callBack(e);	
			}				
		}
		try{
			require("../modules/file.js").init(_data._config.uploadPath).md5(postFileInfo, getMD5);
		}
		catch(e){
			var sendIP = _data._config.serverIP + ":" + _data._config.communicationPort;
			require("../modules/log2Server.js").send(sendIP, _data.client_id, 3, "[execUpload] get file md5 err", _data._config.publicIP);
			callBack(e);	
		}	
		
	
		// 上傳檔案
		//fs = require('fs');		
		// try{
			// fs.readFile(file_info[_data.partition_file_name].path, function (err, data) {
				// var newName = _data.client_id + "." + _data.partition_file_path + "." + file_info[_data.partition_file_name].name;
				// var newPath = __dirname + "/.." + _data._config.uploadPath + newName;
				// console.log(newPath);
				// // 上傳之後的檔案是暫存檔案，需更新路徑至正確路徑
				// fs.writeFile(newPath, data, function (err) {
					// if (!err) {
						// _data.uploadResult = 1;
						// callBack(false, job);
					// }			
				// });
			// });
		// }catch(e){
			// callBack(e);
		// }
		
		
	},
	
	
	that = {
		init: init,
		execute: execute
	};
	return that;		
}	
	