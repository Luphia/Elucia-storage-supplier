
module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},

	execute = function(_data, callBack){
		console.log("####### in function retunrUpdateResult ######## ");
		
		// 若 token 與 upload 皆成功則 result = 1
		if(_data.checkResult == 1 && _data.uploadResult == 1){
			_data.result = 1;
			//console.log(_data.result);
			callBack(false, job);
		} else{
			_data.result = 0;
			_data._result.result = 0;
			//console.log(_data.result);
			callBack(false, job);
		}	
	},
	
	
	that = {
		init: init,
		execute: execute
	};
	return that;		
}	
	