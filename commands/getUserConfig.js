module.exports = function() {
	var job,

	init = function(_job)
	{
		job = _job;
		return this;
	},
 
	execute = function(_data, _callback)
	{
		try 
		{
			var role = _data.user.role,
				apps = [
					{"title": "File Browser", "icon": "file.browser.png", "group": "user", "widget": "browser"},
					{"title": "Usage Analysis", "icon": "usage.analysis.png", "group": "user", "widget": "usageAnalyze"},
					{"title": "Config", "icon": "config.png", "group": "supplier", "widget": "sysSupplierCof"}
				];

				if(_data._config.enable)
				{
					apps.push({"title": "Node Monitor", "icon": "node.monitor.png", "group": "supplier", "widget": "supplier"});
				}

			_data._result.result = 1;
			_data._result.data = {
				"username": _data.user.username,
				"role": role,
				"apps": apps
			};

			_callback(false, job);
		}
		catch(e) 
		{
			_callback(e);
		}

	},

	that = {
		init: init,
		execute: execute
	};
	return that;
}