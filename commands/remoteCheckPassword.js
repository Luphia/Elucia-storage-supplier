module.exports = function() {
	var job,

	init = function(_job) {
		job = _job;
		return this;
	},

	execute = function(_data, _callback) {
		var account = _data.account,
			password = _data.password,
			clientId = _data.clientId;

		try{
			var getResult = function(data) {
				_data._result = JSON.parse(data);
				_callback(false, job);
			};

			var rest = new require("../modules/restRequest")(),
				option = {
				"host": "http://"+ _data._config.serverIP + ':' + _data._config.communicationPort
					+ "/checkPassword/" + account + '/' + password,
				"data": {},
				"callBack": {"success": getResult},
				"publicIP": _data._config.publicIP
			};
			rest.get(option);
				
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