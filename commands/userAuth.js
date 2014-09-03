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
			var code = _data._config.register;
			var checkdata = JSON.stringify(_data.user);
			var crypto = require('crypto');
			var hash = crypto.createHash('md5').update(checkdata).digest('hex');

			if(hash == code) {
				_data._result = {
					"resutl": 1,
					"data": {},
					"message": ""
				};
				_data._continue = true;
			}
			else {
				_data._result = {
					"resutl": 0,
					"data": {},
					"message": "wrong account or password!"
				};
				_data._continue = false;
			}
			_callBack(false, job);
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
	