
module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},

	// �ˬd VM
	execute = function(_data, callBack){
		console.log("####### in function execUpload ######## ");
		//console.log(_data.checkResult);
		// ���P�_ token �O�_�q�L
		if(_data.checkResult == 0){
			_data.uploadResult = 0;
			callBack(false, job);
			return;
		}
		//console.log(_data);
		
		
		// �W���ɮ�		
		file_info = _data.file_info; // ���ɮ׸��
				
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
		
		// �W���ɮ�
		//fs = require('fs');		
		// try{
			// fs.readFile(file_info[_data.partition_file_name].path, function (err, data) {
				// var newName = _data.client_id + "." + _data.partition_file_path + "." + file_info[_data.partition_file_name].name;
				// var newPath = __dirname + "/.." + _data._config.uploadPath + newName;
				// console.log(newPath);
				// // �W�Ǥ��᪺�ɮ׬O�Ȧs�ɮסA�ݧ�s���|�ܥ��T���|
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
	