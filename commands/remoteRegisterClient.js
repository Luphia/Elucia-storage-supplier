module.exports = function() {
	var job,

	init = function(_job) {
		job = _job;
		return this;
	},

	execute = function(_data, _callback) {
		try{
			var getResult = function(data) {
				_data._result = JSON.parse(data);
				_callback(false, job);
			};

			var rest = new require("../modules/restRequest")(),
				option = {
				"host": "http://"+ _data._config.serverIP +":"+ _data._config.communicationPort
					+ "/register/registerClient",
				"data": {
					"username": _data.account,
					"password": _data.password,
					"machineNumber": _data.machineNumber,
					"machineIp": _data.machineIp,
					"machineName": _data.machineName,
					"contact": _data.contact,
					"status": 1
				},
				"callBack": {"success": getResult},
				"publicIP": _data._data.machineIp
			};
			rest.post(option);
				
		}
		catch(e) {
			_callback(e);
		}
	},

	that = {
		init: init,
		execute: execute
	};

	return that;
}