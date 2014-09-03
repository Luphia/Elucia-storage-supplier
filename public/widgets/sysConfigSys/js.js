define(function()
{
	var sysConfigSys = function()
	{
		var node,
			data,

		init = function(_node, _data)
		{
			this.node = _node;
			this.data = _data;

			return this;
		},

		destroy = function() 
		{
			this.node.remove();
		},

		that = 
		{
			init: init,
			destroy: destroy
		};

		return that;
	}

	return sysConfigSys;
});