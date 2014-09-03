define(function()
{
	var sysSupplierCofMenu = function()
	{
		var node,
			data,

		init = function(_node, _data)
		{
			this.node = _node;
			this.data = _data;
			this.children = [];

			//click
			var that = this;
			this.check = true;
			$("div.item",this.node).each(function()
			{		
				$(this).click(function()
				{
					if(that.check == true)
					{
						that.check = false;
						that.reset();

						$("div.item",this.node).removeClass("clicked");
						$(this).addClass("clicked");

						//get data for content						
						if($(this).hasClass("backup"))
						{
							that.getApi("sysSupplierConfig/backup",function(data)
							{
								that.getBackup(data);
							});
						}
						else if($(this).hasClass("share"))
						{
							//var tmpData = that.getApi("sysSupplierConfig/share");
							that.getShare();	
						}						
						else if($(this).hasClass("status"))
						{
							that.getStatus(data);
						}							
						else
						{
							that.getApi("sysSupplierConfig/basic",function(data)
							{
								that.getBasic(data);
							});
						}		
					}								
				});						
			});

			//init
			that.getApi("sysSupplierConfig/basic",function(data)
			{
				that.getBasic(data);
			});

			return this;			
		},

		getApi = function(_url,_callBack)
		{
			elucia.rest.get(
			{
				url: _url,
				success: function(_data) 
				{
					_callBack(_data);
				}
			});	
		},

		getBasic = function(_data)
		{		
			var tmpWidget = 
			{
		       	"name": "sysSupplierCofMenuBasic",
		    	"data": 
		    	{
		    		"basic":_data.data.basic,
		    		"backup":_data.data.backup,
		    		"uploadPath":_data.data.uploadPath
		    	}
		    },

		    that = this;
			elucia.addTo(tmpWidget, $("div.menuContent",this.node.parent().parent()), function(_node, _data, _obj) 
			{
				that.children.push(_obj);
				that.check = true;
			});
		},

		getShare = function()
		{
			var tmpWidget = 
			{
		       	"name": "sysSupplierCofMenuShare",
		    	"data": {}
		    }

		    that = this;
			elucia.addTo(tmpWidget, $("div.menuContent",this.node.parent().parent()), function(_node, _data, _obj) 
			{
				that.children.push(_obj);
				that.check = true;
			});
		},

		getBackup = function(_data)
		{
			var tmpWidget = 
			{
		       	"name": "sysSupplierCofMenuBackup",
		    	"data": _data.data
		    },

		    that = this;
			elucia.addTo(tmpWidget, $("div.menuContent",this.node.parent().parent()), function(_node, _data, _obj) 
			{
				that.children.push(_obj);
				that.check = true;
			});
		},

		getStatus = function(_data)
		{
			var tmpWidget = 
			{
		       	"name": "sysSupplierCofMenuStatus",
		    	"data": {}
		    },

		    that = this;
			elucia.addTo(tmpWidget, $("div.menuContent",this.node.parent().parent()), function(_node, _data, _obj) 
			{
				that.children.push(_obj);
				that.check = true;
			});
		},

		reset = function()
		{
			if(this.children.length > 0)
			{
				this.children[0].destroy();
				this.children.splice(0,1);
			}			
		},

		destroy = function() 
		{
			for(var key in this.children)
			{
				this.children[key].destroy();
				this.children.splice(key,1);
			}

			this.node .remove();
		},

		that = 
		{
			init: init,
			getApi:getApi,
			getStatus:getStatus,
			getShare:getShare,
			getBasic:getBasic,
			getBackup:getBackup,
			reset:reset,
			destroy: destroy
		};

		return that;
	}

	return sysSupplierCofMenu;
});