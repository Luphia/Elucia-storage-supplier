define(function()
{
	var sysSupplierCofMenuBasic = function()
	{
		var node,
			data,

		init = function(_node, _data)
		{
			this.node = _node;
			this.data = _data;
			this.children = [];
			this.backupStatus = true;
			this.supplierStatus = true;

			//first
			var that = this;
			this.getData(function()
			{
				that.addSwtich();
			});	

			$("input[name=basicSubmit]",this.node).click(function()
			{
				that.saveData();
			});

			return this;
		},

		addSwtich = function()
		{
			var that = this;
			var tmpWidget = 
			{
		       	"name": "switch",
		    	"data": 
		    	{
		    		status : this.supplierStatus,
		    		on : function()
		    		{
		    			that.switchOn("supplierStatus");
		    		},

		    		off: function()
		    		{
						that.switchOff("supplierStatus");
		    		},
		    	}
		    }

			elucia.addTo(tmpWidget, $("div.enableSupplier", this.node), function(_node, _data, _obj) 
			{
				that.children.push(_obj);
			});

			var tmpWidget = 
			{
		       	"name": "switch",
		    	"data": 
		    	{
		    		status : this.backupStatus,
		    		on : function()
		    		{
		    			that.switchOn("backupStatus");
		    		},

		    		off: function()
		    		{
						that.switchOff("backupStatus");
		    		},
		    	}
		    }

			elucia.addTo(tmpWidget, $("div.enableBackup", this.node), function(_node, _data, _obj) 
			{
				that.children.push(_obj);
			});

			
		},

		switchOn = function(_action)
		{
			if(_action == "supplierStatus")
				this.supplierStatus = true;
			else if(_action == "backupStatus")
				this.backupStatus = true;
		},

		switchOff = function(_action)
		{
			if(_action == "supplierStatus")
				this.supplierStatus = false;
			else if(_action == "backupStatus")
				this.backupStatus = false;
		},

		getData = function(_callBack)
		{
			console.log(this.data);
			//enable
			if(this.data.backup.enable == true)
			{
				this.backupStatus = true;				
			}			
			else
			{
				this.backupStatus = false;
			}	

			$("input[name=ip]",this.node).val(this.data.basic.center_url);
			$("input[name=name]",this.node).val(this.data.basic.username);
			$("input[name=pass]",this.node).val(this.data.basic.password);
			$("input[name=pass2]",this.node).val(this.data.basic.password);

			//$("input[name=uploadPath]",this.node).val(this.data.uploadPath);	

			_callBack();
		},

		saveData = function()
		{
			// console.log("supplierStatus : "+this.supplierStatus);
		 //    console.log("backupStatus : "+this.backupStatus);

			var that = this;
			elucia.rest.post(
			{	
				url:"/sysSupplierConfig/basic",
        	    'Authorization': 'Bearer ' + configuration.user.token,
        	    'data':
        	    {
        	    	"center_url":$("input[name=ip]",that.node).val(),
        	    	"username":$("input[name=name]",that.node).val(),
        	    	"password":$("input[name=pass]",that.node).val(),
        	    	//"uploadPath":$("input[name=uploadPath]",that.node).val(),
        	    	"supplierStatus":that.supplierStatus,
        	    	"backupStatus":that.backupStatus,
        	    	"period":that.data.backup.period,
        	    	"maxPartSize":that.data.backup.max_part_size
        	    },
				success: function(_data) 
				{	console.log(_data);
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
			for(var key in this.children)
				this.children[key].destroy();

			this.children = [];

			this.node.remove();
		},

		that = 
		{
			init: init,
			getData:getData,
			addSwtich:addSwtich,
			switchOff:switchOff,
			switchOn:switchOn,
			saveData:saveData,
			destroy: destroy
		};

		return that;
	}

	return sysSupplierCofMenuBasic;
});