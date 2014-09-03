define(function()
{
	var sysSupplierCof = function()
	{
		var node,
			data,

		init = function(_node, _data)
		{
			this.node = _node;
			this.data = _data;
			this.children = [];

			this.getMenu();

			return this;
		},

		getMenu = function()
		{
			var tmpWidget = 
			{
		       	"name": "sysSupplierCofMenu",
		    	"data": {}
		    },

		    that = this;
			elucia.addTo(tmpWidget, $("div.menu", this.node), function(_node, _data, _obj) 
			{
				that.children.push(_obj);
			});
		},

		destroy = function() 
		{
			for(var key in this.children)
				this.children[key].destroy();

			this.children = [];
		},

		that = 
		{
			init: init,
			getMenu:getMenu,
			destroy: destroy
		};

		return that;
	}
	
	return sysSupplierCof;
});