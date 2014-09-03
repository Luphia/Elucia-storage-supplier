
module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},

	// 檢查 VM
	execute = function(_data, callBack){
		console.log("####### in function execDownload ######## ");
		console.log(_data.checkResult);
		
		// 先判斷 token 是否通過
		if(_data.checkResult == 0){
			_data.uploadResult = 0;
			callBack(false, job);
			return;
		}
		
		try{
			/*
			// D:\svn_openstack_2\develop\Backend\iServStorage\Supplier\public\upload\13.dir1.dir2.dir3.test2.txt
			var newName = _data.client_id + "." + _data.partition_file_path + "." + _data.partition_file_name;
			var download_file_path = "." + _data._config.uploadPath + newName;
			console.log(download_file_path);
			
			_data.download_file_path = download_file_path;
			//_data.res.download(file); // Set disposition and send it.
			console.log(_data.download_file_path);
			_data.downloadResult = 1;
			*/
			// callBack 回上一層做下載

			
			var writePath = _data.client_id + "/" + _data.partition_file_path;
			// get hex file name
			console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> try to get hex file name");
			_data.file_hex_path = require("../modules/file").init(_data._config.uploadPath).pathEncode(writePath);					
			console.log(_data.file_hex_path);		

			// get file md5
			var file_tmp = {
				"path":_data.file_hex_path
			}
			var getMD5 = function(flag,data) {
				_data.file_md5 = data;				
			}
			try{
				require("../modules/file.js").init(_data._config.uploadPath).md5(file_tmp, getMD5);
			}
			catch(e){
				callBack(e);	
			}	
			
			console.log("######### in execDownload 2");
			_data.downloadResult = 1;
			callBack(false, job);
			
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
	