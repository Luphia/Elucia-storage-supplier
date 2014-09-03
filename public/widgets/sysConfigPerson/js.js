define(function()
{
	var sysConfigPerson = function()
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

		},

		that = 
		{
			init: init,
			destroy: destroy
		};

		return that;
	}

	return sysConfigPerson;
});