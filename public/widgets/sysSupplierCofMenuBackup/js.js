define(function()
{
	var sysSupplierCofBackup = function()
	{
		var node,
			data,

		init = function(_node, _data)
		{
			this.node = _node;
			this.data = _data;
			this.children = [];

			var that = this;

			//first	
			this.getData(function()
			{
				that.selectFolder();
				that.deletePath();
				that.addPath();
				that.deletePath();
			});

			//tag	
			$("div.tag",this.node).click(function()
			{
				that.changeTag(this);
			});

			//init
			$("div.tagContent > div.backup",that.node).show();

			//backup now
			$("input[name=backupNow]",this.node).click(function()
			{
				that.backupNow();
			});

			//backup submit
			$("input[name=backupSubmit]",this.node).click(function()
			{
				that.saveBackupData();
			});

			//retore submit
			$("input[name=restoreSubmit]",this.node).click(function()
			{
				that.saveData();
			});

			//key download
			$("input[name=keyDownload]",this.node).click(function()
			{
				elucia.rest.get(
				{
					"url":"/sysSupplierConfig/KeyGet",
					success: function(_data) 
					{
						if(_data.result == 1)
						{
							_callBack(_data);
						}
					}
				});
			});

			//key upload use file api
			$("input[name=keyUploadSure]",this.node).click(function()
			{
				var xhr = new XMLHttpRequest(),
					formData = new FormData(),
					file = document.getElementById('files').files[0];

				if(file.length == 0)
					return false;

				$("#uploadProgress",this.node).fadeIn("slow").css({"display":"inline-block"});

				formData.append('key', file);

				xhr.onreadystatechange = function()
				{
		            if(xhr.readyState === 4 && xhr.status === 200)
		            { 
		                var result = JSON.parse(xhr.responseText);
		                if(result.result == 1)
		               	{
		               		alert("upload success");
		               	}   
		               	else
		               	{
		               		alert("upload error");
		               	}         
		            }	            	
		        }

		        xhr.upload.onprogress = function(e) 
		        {
		        	if(e.lengthComputable) 
                    {
                        var complete = (event.loaded / event.total * 100 | 0);
                        $("#uploadProgress").prop("value",complete);
                        if(complete == 100)
                        {
                        	setTimeout(function()
                        	{
                        		 $("#uploadProgress").fadeOut("slow");
                        	},2000);                  	
                        }
                    }
		        }

				xhr.open('post', "sysSupplierConfig/KeyUpload");			
				xhr.send(formData);
			});

			return this;
		},

		changeTag = function(_this,_text)
		{
			$("div.tag",that.node).removeClass("clilced");
			$(_this,that.node).addClass("clilced");

			$("div.tagContent > div",that.node).hide();

			//change
			if($(_this).hasClass("backupSetting"))
			{
				$("div.tagContent > div.backup",that.node).fadeIn();
			}
			else if($(_this).hasClass("restoreSetting"))
			{
				$("div.tagContent > div.restore",that.node).fadeIn();
			}
			else if($(_this).hasClass("keySetting"))
			{
				$("div.tagContent > div.keySet",that.node).fadeIn();
			}
		},

		backupNow = function()
		{
			var url = "/sysSupplierConfig/backupNow";
			var data = {}

			postData(url,data);
		},

		addPath = function()
		{
			var that = this;

			//add backup path
			$("div.addBackupIcon",this.node).unbind("click").click(function()
			{
				var tb = $("table[name=backupPathSetting] tbody"),
					tr = $("<tr></tr>").hide(),
					visualFolderInput = $("<input>").prop("name","visualFolderName")
													.prop("type","text");

					backupPathInput = $("<input>").prop("name","backupPath")
												  .prop("type","text")
												  .prop("readonly","readonly")
												  .addClass("folder"),
					selectDiv = $("<div></div>").addClass("selectIcon").prop("title","select folder"),
					div = $("<div></div>").addClass("removeIcon").prop("title","delete path"),

				tr.appendTo(tb).fadeToggle();
				$("<td></td>").html(visualFolderInput).appendTo(tr);
				$("<td></td>").html(backupPathInput).append(selectDiv).addClass("contentLeft").appendTo(tr);
				$("<td></td>").html(div).appendTo(tr);

				that.deletePath();
				that.selectFolder();
			});


			//add restore path
			$("div.addIcon",this.node).unbind("click").click(function()
			{
				var tb = $("table[name=pathSetting] tbody"),
					tr = $("<tr></tr>").hide(),
					visualFolderInput = $("<select>").prop("name","visualFolderName"),

					backupPathInput = $("<input>").prop("name","backupPath")
												  .prop("type","text")
												  .prop("readonly","readonly")
												  .addClass("folder"),
					selectDiv = $("<div></div>").addClass("selectIcon").prop("title","select folder"),
					div = $("<div></div>").addClass("removeIcon").prop("title","delete path");

				//append to select
				$("<option>").val("").text("").appendTo(visualFolderInput);

				if(that.data.hasOwnProperty())
				{
					var restoreData = that.data.restore.restore;
					for(var key in restoreData.virtual)
					{
						$("<option>").val(restoreData.virtual[key]).text(restoreData.virtual[key]).appendTo(visualFolderInput);
					} 
				}
				else
				{
					$("<option>").val("").text("").appendTo(visualFolderInput);
				}
				

				tr.appendTo(tb).fadeToggle();;
				$("<td></td>").html(visualFolderInput).appendTo(tr);
				$("<td></td>").html(backupPathInput).append(selectDiv).addClass("contentLeft").appendTo(tr);
				$("<td></td>").html(div).appendTo(tr);

				that.deletePath();
				that.selectFolder();
			});
		},

		//delete now path
		deletePath = function()
		{
			//delete path
			$("div.removeIcon",this.node).unbind("click").click(function()
			{
				$(this).parent().parent().animate({"left":3000},function(){
					$(this).remove();
				});
			});
		},

		//select path icon
		selectFolder = function()
		{		
			$("div.selectIcon",this.node).unbind("click").click(function()
			{	
				//remove class
				$("input.nowPathSet",this.node).removeClass("nowPathSet");

				//add now class
				$(this).prev().addClass("nowPathSet");

				//delete before content
				that.deleteSelectDiv();

				//add listDir after css
				$("div.shadow",that.node).show();

				var tmpWidget = 
				{
			       	"name": "sysSupplierCofMenuBackupListDir",
			    	"data": {}
			    }

				elucia.addTo(tmpWidget, $("div.listDir",that.node), function(_node, _data, _obj) 
				{
					that.children.push(_obj);
				});		
			});
		},

		//empty list dir div
		deleteSelectDiv = function()
		{
			if(this.children.length > 0)
			{
				for(var key in this.children)
				{
					this.children[key].destroy();
				}					

				this.children = [];
			}		
		},

		getData = function(_callBack)
		{	
			var that = this;
			if(this.data.hasOwnProperty("backup") && this.data.hasOwnProperty("restore"))
			{
				//period
				$("select[name=period] option",this.node).each(function()
				{				
					if(that.data.backup.period == $(this).val())
					{
						$(this).prop("selected","selected");
					}
				});

				/*****visualFolder*****/
				var tb = $("table[name=pathSetting] tbody"),
					tb2 = $("table[name=backupPathSetting] tbody");

				//backup
				var backupData = this.data.backup.backup;
				for(var key in backupData.real)
				{
					var tr = $("<tr></tr>"),
						visualFolderInput = $("<input>").prop("name","visualFolderName")
														.prop("type","text")
														.val(backupData.virtual[key]),

						backupPathInput = $("<input>").prop("name","backupPath")
													  .prop("type","text")
													  .prop("readonly","readonly")
													  .addClass("folder")
													  .val(backupData.real[key]),

						selectDiv = $("<div></div>").addClass("selectIcon").prop("title","select folder"),
						div = $("<div></div>").addClass("removeIcon").prop("title","delete path");

					tr.appendTo(tb2);
					
					$("<td></td>").html(visualFolderInput).appendTo(tr);
					$("<td></td>").html(backupPathInput).append(selectDiv).addClass("contentLeft").appendTo(tr);
					$("<td></td>").html(div).appendTo(tr);
				}

				//restore
				var restoreData = this.data.restore.restore;
				for(var key in this.data.restore.restore.real)
				{
					var tr = $("<tr></tr>"),
						visualFolderInput = $("<select>").prop("name","visualFolderName"),

						backupPathInput = $("<input>").prop("name","backupPath")
													  .prop("type","text")
													  .prop("readonly","readonly")
													  .addClass("folder")
													  .val(restoreData.real[key]),

						selectDiv = $("<div></div>").addClass("selectIcon").prop("title","select folder"),
						div = $("<div></div>").addClass("removeIcon").prop("title","delete path");

					tr.appendTo(tb);

					$("<option>").val("").text("").appendTo(visualFolderInput);
					for(var key in restoreData.virtual)
					{
						$("<option>").val(restoreData.virtual[key]).text(restoreData.virtual[key]).appendTo(visualFolderInput);
					} 
					
					$("<td></td>").html(visualFolderInput).appendTo(tr);
					$("<td></td>").html(backupPathInput).append(selectDiv).addClass("contentLeft").appendTo(tr);
					$("<td></td>").html(div).appendTo(tr);
				}			
			}

			_callBack();
		},

		//restore
		saveData = function()
		{	
			var check = false,
				empty = false;

			//visualFolder & backupPath
			var visualFolderName = [],backupPath = [];
			$("table[name=pathSetting] select[name=visualFolderName]",that.node).each(function()
			{
				visualFolderName.push($(this).val());			
			});

			$("table[name=pathSetting] input[name=backupPath]",that.node).each(function()
			{
				if($(this).val() == "")
				{
					alert("backup path is empty");
					empty = true;
				}

				backupPath.push($(this).val());	
				check = true;				
			});	

			//wait
			while(!check){}

			
			if(empty)
				return false;	

			//post data
			var url = "/sysSupplierConfig/backup",
				data = 
				{
					"path":"retore",
					"real":backupPath,
					"virtual":visualFolderName
				}

			postData(url,data);

		},

		//backup
		saveBackupData = function()
		{
			var check = false,
				check2 = false,
				empty = false;

			//period
			var period = $("select[name=period]").val();
		
			//visualFolder & backupPath
			var visualFolderName = [],backupPath = [];
			$("table[name=backupPathSetting] input[name=visualFolderName]",that.node).each(function()
			{
				if($(this).val().trim() == "" || $(this).val().trim() == "/")
				{
					$(this).focus();
					alert("visual folder name is empty");
					empty = true;
				}
					
				visualFolderName.push($(this).val().trim());
				check = true;						
			});

			$("table[name=backupPathSetting] input[name=backupPath]",that.node).each(function()
			{
				if($(this).val() == "")
				{
					$(this).focus();
					alert("backup path is empty");
					empty = true;
				}

				backupPath.push($(this).val().trim());	
				check2 = true;				
			});		

			//wait
			while(!check || !check2){}

			if(empty)
				return false;

			//post data
			var url = "/sysSupplierConfig/backup",
				data = 
				{
					"enable":this.data.backup.enable,
					"path":"backup",
					"period":period,
					"real":backupPath,
					"virtual":visualFolderName
				}

			postData(url,data);
		},

		postData = function(_url,_data)
		{
			elucia.rest.post(
			{	
				'url':_url,
        	    'Authorization': 'Bearer ' + configuration.user.token,
        	    'data':_data,
				success: function(_data) 
				{
					if(_data.result == 1)
					{
						alert("backup start");
					}
					else
					{
						alert("backup error");
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
			changeTag:changeTag,
			backupNow:backupNow,
			addPath:addPath,
			deletePath:deletePath,
			saveData:saveData,
			saveBackupData:saveBackupData,
			selectFolder:selectFolder,
			deleteSelectDiv:deleteSelectDiv,
			getData:getData,
			postData:postData,
			destroy: destroy
		};

		return that;
	}

	return sysSupplierCofBackup;
});