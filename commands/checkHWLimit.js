
module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},
	
	execute = function(_data, callBack){
		console.log("####### in function checkHWLimit ######## ");
		var hw_space_limit = _data._config.registerDiskSpace * 1024 * 1024 * 1024; // convert to bytes
		var hw_bandwidth_limit = _data._config.registerDiskSpace;
		var todo = 1;
		var hw_space_limit_flag = 0;
		var hw_bandwidth_limit_flag = 0;
		
		
		// get used space in folder		
		var exec = require('child_process').exec;
		exec('du -b upload | grep -o \'\[0\-9\]\*\'', function (error, stdout, stderr){
			var usage_space = stdout.trim();
			if(usage_space > hw_space_limit){
				hw_space_limit_flag = 1;
				console.log("exceed space limit!");
				console.log(usage_space);
				console.log(hw_space_limit);
			}else{
				hw_space_limit_flag = 0;
			}
			todo --;
			doCallBack();							
		});			

		var doCallBack = function(){
			
			if(todo == 0) {
				if(hw_space_limit_flag == 1){
					_data.checkHWLimit = 0;
					_data._result.data = "exceed hw limit";
				}else{
					_data.checkHWLimit = 1;
				}
				callBack(false,job);
			}
		}	
		
	},
	
	
	that = {
		init: init,
		execute: execute
	};
	return that;		
}	
	