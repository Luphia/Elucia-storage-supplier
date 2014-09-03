
module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},
	// 檢查 VM
	execute = function(_data, _callBack){
		console.log("####### in function execSyncFileList ######## ");
		if(typeof(_data.fileList[0]) == "undefined"){
			_callBack(false,job);
			console.log("Get Empty File List");
			return;
		}
		var counter = _data.fileList.length - 1;
		var	tmpMD5;	
		var tmp_path;
				
		var next = function(data){
			//console.log("===> in function next");	
			//counter--;
			//console.log("tmp_path: "+ data);
			tmp_path = data;
			_data.fileList[counter].realpath = data;	
			
		}
		
		var getPath = function(callBack){
			//console.log("===> in function getPath");
			var writePath = _data.fileList[counter].path;	
			var encode_path = require("../modules/file").init(_data._config.uploadPath).pathEncode(writePath);
			//console.log("encode_path : " + encode_path);			
			if(typeof(encode_path) != "undefined"){
				callBack(encode_path);
			}
		}


		var getMD5 = function(flag,data) {
			//var file_tmp_md5 = data;
			tmpMD5 = data;
			//var tmp_counter = counter + 1;
			// console.log("=============================");			
			// console.log("counter : " + counter);
			// console.log("tmp_path : " + tmp_path);
			// console.log("real file md5 : [" + file_tmp_md5 + "]");
			// console.log("receive file md5 : [" + _data.fileList[counter].md5 + "]");
			// console.log("receive file path : [" + _data.fileList[counter].path + "]");
			
			//counter 在 next() 先減 1，需加回來			
			// if(file_tmp_md5 != _data.fileList[counter].md5){
				// console.log("Not Match");
				// _data.fileList[counter].isExistFlag = 0;
			// }else{
				// console.log("Match");
			// }
		}
		
		var go = function(){
			//console.log("===> in function go");			
			getPath(next);		
			//console.log("===> now counter [" + counter + "]");
			//console.log(tmp_path);
			var fs = require('fs');
			fs.exists(tmp_path, function(exists) {
				if (exists){
					//console.log("OK");
					_data.fileList[counter].isExistFlag = 1;
					// var file_tmp = {
						// "path":tmp_path
					// }
					// check file md5
					//require("../modules/file.js").init(_data._config.uploadPath).md5(file_tmp, getMD5);
					// if(_data.fileList[counter].md5 != tmpMD5){
						// console.log("Not Match");
						// _data.fileList[counter].isExistFlag = 0;
					// }else{
						// console.log("Match");
					// }
				}else{
					console.log("###################### " + tmp_path + " not exist");
					//console.log("_data.fileList[counter].isExistFlag: " + _data.fileList[counter].isExistFlag);
					_data.fileList[counter].isExistFlag = 0;
		
					// unlink file
					// fs.unlink(tmp_path, function (err) {
					  // if (err) throw err;
					  // console.log('Successfully deleted : ' + tmp_path);
					// });					
				}
				if(counter > 0 ){
				//if(counter < _data.fileList.length ){
					//counter--;
					go();
				}else{
					//console.log(data.fileList);
					_callBack(false,job);
					return;
				}				
			});
			counter--;
		}		
		
		var main = function(callBack){
			//console.log("===> in function main");
			//var path = next(getPath);
			go();
		}

		main();
	},
	
	
	that = {
		init: init,
		execute: execute
	};
	return that;		
}	
	