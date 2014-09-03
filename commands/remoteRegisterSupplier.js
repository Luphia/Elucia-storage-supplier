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
					+ "/register/registerSupplier",
				"data": {
					"name": _data.account,
					"contact": "contact",
					"totalSpace": 1024,
					"port": _data._config.communicationPort,
					"bandwith": Math.random() * 512 + 10,	// 取得本機頻寬
					"machineUId": 4,
					"clientId": _data.clientId
				},
				"callBack": {"success": getResult},
				"publicIP": _data.machineIp
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