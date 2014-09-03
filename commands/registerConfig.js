/*
 * @Function: 寫入 Config 資訊
 * @Author: mengtsang
 * @Date: 2014/03/14
 */
module.exports = function()
{
	var job,

	init = function(_job)
	{
		job = _job;
		return this;
	},

	execute = function(_data, _callback)
	{
		var checkdata = JSON.stringify(_data.user),
			config = require('../modules/config.js'),
			crypto = require('crypto'),
			hashCode = crypto.createHash('md5').update(checkdata).digest('hex'),
			myConfig = new config();
		try {
			myConfig.init(_data.path, _data.defaultPath,function() {
				myConfig.attr("register", hashCode);
				myConfig.attr("publicIP", _data.publicIP);
				myConfig.save(function(err) {
					if (err) {
						_data._result.result = 0;
						_data._result.message = "Save Config fail";
						_callback(false, job);
					}
					else {
						_data._result.result = 1;
						_data._result.message = "Save Config success";
						_callback(false, job);
					}
				});
			});
		}
		catch(e) {
			_callback(e);
		}					
	},

	that = 
	{
		init: init,
		execute: execute
	};

	return that;
}