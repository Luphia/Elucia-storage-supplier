/*
	_data.user = {
		"account": 用戶名稱,
		"password": 密碼
	}

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
			var getResult = function(data, header) {
				//_data._result = JSON.parse(data);
				var tmpCookie = header["set-cookie"][0];
				var tmpSID = tmpCookie.split(";")[0];
				_data._result.data.agentHeader = {"cookie": tmpSID};
				_callBack(false, job);
			};
			var rest = new require("../modules/restRequest")();
			var option = {
				"host": "http://"+ _data._config.agent.ip +":"+ _data._config.agent.port +"/basic_setting", 
				"data": {
					"center_url": "http://"+ _data._config.serverIP +":"+ _data._config.communicationPort+"/",
					"username": _data.user.username,
					"password": _data.user.password
				},
				"callBack": {"success": getResult}
			};
			rest.post(option);		
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
	