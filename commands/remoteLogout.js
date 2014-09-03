/*
	_data.token = 用戶 token

	_data._config = {
		"serverIP": center IP,
		"communicationPort" center Port
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
			var getResult = function(data) {
				_data._result = JSON.parse(data);
				_callBack(false, job);
			};
			var rest = new require("../modules/restRequest")();
			var option = {
				"host":"http://"+ _data._config.serverIP +":"+ _data._config.communicationPort +"/token/"+ _data.token, 
				"data": {"username":"test", "password":"test"}, 
				"callBack": {"success": getResult},
				"publicIP": _data._config.publicIP
			};
			rest.del(option);		
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
	