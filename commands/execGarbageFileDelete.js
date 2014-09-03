
module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},

	// ÀË¬d VM
	execute = function(_data, _callBack){
		console.log("####### in function execGarbageFileDelete ######## ");
		var fs = require("fs");
		var files = fs.readdirSync(_data._config.uploadPath);		
		//var counter = files.length - 1;	
		var tmp_path;
		var delete_file_arr = [];

		var next = function(data){
			//console.log("===> in function next");	
			//counter--;
			//console.log("next: "+ data);
			tmp_path = data;
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
		
		
		for(var key_1 in files){
			var upload_tmpName = _data._config.uploadPath + files[key_1];
			
			for(var key_2 in _data.fileList){
				//console.log(_data.fileList[key_2].path);
				counter = key_2;
				getPath(next);
				//counter--;
				
				//if(upload_tmpName == _data.fileList[key_2].path){
				if(upload_tmpName == tmp_path){
					exist_flag = 1;
					break;
				}else{
					exist_flag = 0;
				}

				//break;
				
			}
			if(exist_flag == 0){
				// unlink file
				fs.unlink(upload_tmpName, function (err) {
					if (err) throw err;
					console.log('Successfully deleted : ' + upload_tmpName);
				});
				delete_file_arr.push(upload_tmpName);
				console.log("$$$$$$$$$$$$$$$$$$$$$$");
				console.log(upload_tmpName + " not in db data");
				console.log("$$$$$$$$$$$$$$$$$$$$$$");				
			}		
		}
		
		console.log("####### delete file count : " + delete_file_arr.length);
		_callBack(false,job);


		
		// var go = function(){
			// //console.log("===> in function go");			
			// getPath(next);
			// var unlink_file_name = "";
			// var exist_flag = 0;
			// //console.log("===> now counter [" + counter + "]");
			// //console.log(tmp_path);
			
			// for(var key in files){				
				// var upload_tmpName = "upload/" + files[counter];
				// if (upload_tmpName == tmp_path){
					// exist_flag = 1;
					// break;
				// }else{
					// exist_flag = 0;
					// unlink_file_name = upload_tmpName;
				// }
			// }
			
			
			// // delete the file not in db data
			// if(exist_flag == 0){
				// // unlink file
				// // fs.unlink(unlink_file_name, function (err) {
				  // // if (err) throw err;
				  // // console.log('Successfully deleted : ' + unlink_file_name);
				// // });
				// console.log(unlink_file_name + "not in db data");
			// }
			
			// if(counter > 0 ){			
				// go();
			// }else{
				// _callBack(false,job);
			// }				
		// }		
		
		// var main = function(callBack){
			// //console.log("===> in function main");
			// //var path = next(getPath);
			// go();
		// }

		// main();
	},
	
	
	that = {
		init: init,
		execute: execute
	};
	return that;		
}	
	