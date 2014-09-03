define(function()
{
	var sysSupplierCofMenuStatus = function()
	{
		var node,
			data,

		init = function(_node, _data)
		{
			this.node = _node;
			this.data = _data;

			var that = this;
			$("div.tag",this.node).click(function()
			{
				that.changeTag(this);
			});

			//init
			getData("listbackuptask",function(_data)
			{
				that.appendStatus("backupStatus",_data);
				$("div.tagContent > div.backupStatus",that.node).show();
			});		

			return this;
		},

		changeTag = function(_this)
		{
			var that = this;

			$("div.tag",that.node).removeClass("clilced");
			$(_this,that.node).addClass("clilced");

			$("div.tagContent > div",that.node).hide();

			if($(_this,that.node).hasClass("tagBackupLog"))
			{
				getData("listbackuplog",function(_data)
				{
					that.appendLog("backupLog",_data);
					$("div.tagContent > div.backupLog",that.node).fadeIn();
				});			
			}			
			else if($(_this,that.node).hasClass("tagRestoreStatus"))
			{
				getData("listrestoretask",function(_data)
				{
					that.appendStatus("restoreStatus",_data);
					$("div.tagContent > div.restoreStatus",that.node).fadeIn();
				});			
			}	
			else if($(_this,that.node).hasClass("tagRestoreLog"))
			{
				getData("listrestorelog",function(_data)
				{
					that.appendLog("restoreLog",_data);
					$("div.tagContent > div.restoreLog",that.node).fadeIn();
				});
				
			}	
			else if($(_this,that.node).hasClass("tagBackupStatus"))
			{
				getData("listbackuptask",function(_data)
				{
					that.appendStatus("backupStatus",_data);
					$("div.tagContent > div.backupStatus",that.node).fadeIn();
				});		
			}			
		},

		getData = function(_action,_callBack)
		{		
			elucia.rest.get(
			{
				url: "sysSupplierConfig/status/"+_action,
				success: function(_data) 
				{
					if(_data.result == 1)
					{
						_callBack(_data);
					}
				}
			});	
		},

		appendStatus = function(_target,_data)
		{
			var data = _data.data,
				tbStatus;

			tbStatus = (_target == "backupStatus")? $("div.backupStatus table").html("") : $("div.restoreStatus table").html("")
			
			//task
			var tr = $("<tr>");
			$("<th>").text("task").appendTo(tr);
			tr.appendTo(tbStatus);

			if(data.tasks.length == 0)
			{
				var tr = $("<tr>");
				$("<td>").text("no task").appendTo(tr);
				tr.appendTo(tbStatus);
			}
			else
			{
				for(var key in data.tasks)
				{
					var classOdd = (key%2 == 1)? "odd":"";				
					var tr = $("<tr>").addClass(classOdd);
					$("<td>").text(data.tasks[key]).appendTo(tr);
					tr.appendTo(tbStatus);
				}
			}

			//process
			var tr = $("<tr>");
			$("<th>").text("process").appendTo(tr);
			tr.appendTo(tbStatus);

			if(data.process.length == 0)
			{			
				var tr = $("<tr>")
				$("<td>").text("no process").appendTo(tr);
				tr.appendTo(tbStatus);
			}
			else
			{
				for(var key in data.process)
				{
					var classOdd = (key%2 == 1)? "odd":"";	
					console.log(classOdd);	
					var tr = $("<tr>").addClass(classOdd);;
					$("<td>").text(data.process[key]).appendTo(tr);
					tr.appendTo(tbStatus);
				}
			}		
		},

		appendLog = function(_target,_data)
		{
			var data = _data.data,
				tbLog;

			tbLog = (_target == "backupLog")? $("div.backupLog table").html(""):$("div.restoreLog table").html("");

			//failure
			var tr = $("<tr>");
			$("<th>").text("failure").appendTo(tr);
			tr.appendTo(tbLog);

			if(data.failure.length == 0)
			{
				var tr = $("<tr>");
				$("<td>").text("no failure").appendTo(tr);
				tr.appendTo(tbLog);
			}
			else
			{
				for(var key in data.failure)
				{
					var classOdd = (key%2 == 1)? "odd":"";		
					var tr = $("<tr>").addClass(classOdd);
					$("<td>").text(data.failure[key]).appendTo(tr);
					tr.appendTo(tbLog);
				}
			}

			//done
			var tr = $("<tr>");
			$("<th>").text("done").appendTo(tr);
			tr.appendTo(tbLog);

			if(data.done.length == 0)
			{
				var tr = $("<tr>");
				$("<td>").text("no done").appendTo(tr);
				tr.appendTo(tbLog);
			}
			else
			{
				for(var key in data.done)
				{
					var classOdd = (key%2 == 1)? "odd":"";	
					var tr = $("<tr>").addClass(classOdd);
					$("<td>").text(data.done[key]).appendTo(tr);
					tr.appendTo(tbLog);
				}
			}		
		},


		destroy = function() 
		{
			this.node.remove();
		},

		that = 
		{
			init: init,
			changeTag:changeTag,
			getData:getData,
			appendLog:appendLog,
			appendStatus:appendStatus,
			destroy: destroy
		};

		return that;
	}

	return sysSupplierCofMenuStatus;
});