
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
		//console.log(_data.checkResult);
		// 先判斷 token 是否通過
		if(_data.checkResult == 0){
			_data.uploadResult = 0;
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
		
		try
		{
			//upload files
			require("../modules/file.js").init(_data._config.uploadPath).upload(postFileInfo, writePath);
			callBack(false, job);
		}
		catch(e)
		{
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
	