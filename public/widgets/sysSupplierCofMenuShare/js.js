define(function()
{
	var Analyze = function()
	{
		var node,
			data,

		init = function(_node, _data)
		{
			this.node = _node;
			this.data = _data;

			var that = this;

			//get data
			this.getData();

			//slideFlowLimit
			$("input[name=slideFlowLimit]",this.node).change(function()
			{
				$("input[name=flowLimit]",that.node).val($(this).val());
			});

			//flowLimit
			$("input[name=flowLimit]",that.node).change(function()
			{
				if($("input[name=flowLimit]",that.node).val() > 204800)
					$("input[name=flowLimit]",that.node).val(204800);
			});

			//slideSpaceLimit
			$("input[name=slideSpaceLimit]",this.node).change(function()
			{
				$("input[name=spaceLimit]",that.node).val($(this).val());
			});

			//spaceLimit
			$("input[name=spaceLimit]",that.node).change(function()
			{
				if($("input[name=spaceLimit]",that.node).val() > 20)
					$("input[name=spaceLimit]",that.node).val(20);
			});

			//shareSubmit
			$("input[name=shareSubmit]",this.node).click(function()
			{
				that.saveData(that.data);
			});

			return this;
		},

		getData = function()
		{
			var that = this;
			elucia.rest.get(
			{
				"url":"/sysSupplierConfig/share",
        	    //'Authorization': 'Bearer ' + configuration.user.token,
        	    success: function(_data) 
				{
					that.data = _data;

					var flowLimit = _data.data.downloadSpeedLimit,
						spaceLimit = _data.data.registerDiskSpace;

					$("input[name=slideFlowLimit]",that.node).val(flowLimit/1024);
					$("input[name=flowLimit]",that.node).val(flowLimit/1024);
					$("input[name=slideSpaceLimit]",that.node).val(spaceLimit);
					$("input[name=spaceLimit]",that.node).val(spaceLimit);	
				}
			});
		},

		saveData = function(_data)
		{
			var flowLimit = $("input[name=flowLimit]",this.node).val();
			var spaceLimit = $("input[name=spaceLimit]",this.node).val();
			
			if(isNaN(parseInt(flowLimit)))
			{
				 $("input[name=flowLimit]",this.node).focus();
				alert("valie is not number");
				return false;
			}

			if(isNaN(parseInt(spaceLimit)))
			{
				$("input[name=spaceLimit]",this.node).focus();
				alert("valie is not number");
				return false;
			}

			var that = this;
			elucia.rest.post(
			{	
				"url":"/sysSupplierConfig/share",
        	    'Authorization': 'Bearer ' + configuration.user.token,
        	    'data':
        	    {
        	    	"download_speed_limit":parseInt(flowLimit)*1024,
        	    	"registerDiskSpace":parseInt(spaceLimit)
        	    },
				success: function(_data) 
				{
					if(_data.result == 1)
					{
						alert("modify success");
					}
					else
					{
						alert("modify error");
					}
				}
			});		
		},

		destroy = function() 
		{
			this.node.remove();
		},

		that = 
		{
			init: init,
			getData:getData,
			saveData:saveData,
			destroy: destroy
		};

		return that;
	}

	return Analyze;
});