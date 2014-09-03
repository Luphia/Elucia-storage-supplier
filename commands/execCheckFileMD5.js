
module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},

	// ÀË¬d VM
	execute = function(_data, _callBack){
		console.log("####### in function execCheckFileMD5 ######## ");
		var counter = _data["fileList"].length - 1;
		console.log("total files: " + counter);
		
		var getMD5 = function(flag,data) {
			// console.log("################");
			// console.log("real md5: " + data);
			// console.log("rece md5: " + _data.fileList[counter].md5);

			if(data != _data.fileList[counter].md5){			
				console.log("################");
				console.log("rece path: " + _data.fileList[counter].realpath);
				console.log("real md5: " + data);
				console.log("rece md5: " + _data.fileList[counter].md5);			
				console.log("Not Match");
				_data.fileList[counter].isExistFlag = 0;
			}else{
				// console.log("Match");
			}
			if(counter >= 0){
				counter--;
				go();
			}
			//checkIfdone();
		}
		
		var go = function(data) {
			// console.log("In func go()");
			if(typeof(_data.fileList[counter]) != "undefined"){
				if(_data.fileList[counter].isExistFlag == 1){
					var file_tmp = {
						"path":_data.fileList[counter].realpath
					}			
					require("../modules/file.js").init(_data._config.uploadPath).md5(file_tmp, getMD5);
				}else{
					counter--;
					go();
				}
			}else{
				if(counter >= 0){
					counter--;
					go();
				}				
			}
		}
				
		go();

	},
	
	
	that = {
		init: init,
		execute: execute
	};
	return that;		
}	
	