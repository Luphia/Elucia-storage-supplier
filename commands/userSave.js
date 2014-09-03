/*
	_data.user = {
		"account": 用戶名稱,
		"password": 密碼
	}


*/

module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},
	
	execute = function(_data, _callBack){
		try {



		}
		catch(err) {
			_callBack(err);
		}
	},
	
	that = {
		init: init,
		execute: execute
	};
	return that;		
}	
	