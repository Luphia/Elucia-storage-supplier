define(function()
{
	var sysConfig = function()
	{
		var node,
			data,

		init = function(_node, _data)
		{
			this.node = _node;
			this.data = _data;
			this.children = [];

			this.addContent();

			$("div.submit").click(function()
			{
				saveData();
			});

			return this;
		},

		addContent = function()
		{
			this.addFile();
			this.addPerson();
			this.addSys();
		},

		addFile = function()
		{
			var tmpWidget = 
			{
		       	"name": "sysConfigFile",
		    	"data": {}
		    },

		    that = this;
			elucia.addTo(tmpWidget, $("div.file > div.content", this.node), function(_node, _data, _obj) 
			{
				$("input[name=fileRepair]",that.node).val(localStorage.sysCofFileRepair);
				$("input[name=fileDivision]",that.node).val(localStorage.sysCofFileDivision);
				$("input[name=fileReplication]",that.node).val(localStorage.sysCofFileReplication);
				that.children.push(_obj);
			});
		},

		addPerson = function()
		{
			var tmpWidget = 
			{
		       	"name": "sysConfigPerson",
		    	"data": {}
		    },

		    that = this;
			elucia.addTo(tmpWidget, $("div.person > div.content", this.node), function(_node, _data, _obj) 
			{
				$("input[name=tokenTime]",that.node).val(localStorage.sysCofTokenTime);
				that.children.push(_obj);
			});
		},

		addSys = function()
		{
			var tmpWidget = 
			{
		       	"name": "sysConfigSys",
		    	"data": {}
		    },

		    that = this;
			elucia.addTo(tmpWidget, $("div.sys > div.content", this.node), function(_node, _data, _obj) 
			{
				$("input[name=sysMonitorPeriod]",that.node).val(localStorage.sysCofSysMonitorPeriod);
				that.children.push(_obj);
			});
		},

		saveData = function()
		{
			localStorage.sysCofTokenTime = $("input[name=tokenTime]",that.node).val();
			localStorage.sysCofFileRepair = $("input[name=fileRepair]",that.node).val();
			localStorage.sysCofFileDivision = $("input[name=fileDivision]",that.node).val();
			localStorage.sysCofFileReplication = $("input[name=fileReplication]",that.node).val();
			localStorage.sysCofSysMonitorPeriod = $("input[name=sysMonitorPeriod]",that.node).val();
			alert("modify success");
		},

		destroy = function() 
		{
			
		},

		that = 
		{
			init: init,
			saveData:saveData,
			addContent:addContent,
			addPerson:addPerson,
			addFile:addFile,
			addSys:addSys,
			destroy: destroy
		};

		return that;
	}

	return sysConfig;
});