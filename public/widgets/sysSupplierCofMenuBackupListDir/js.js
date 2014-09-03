define(function()
{
	var sysSupplierCofMenuBackupListDir = function()
	{
		var node,
			data,

		init = function(_node, _data)
		{
			this.node = _node;
			this.data = _data;
			this.rootPath;

			//show
			$(this.node).parent().css("left","45%").animate({"top": 90});

			var that = this;
			$("div.close",this.node).click(function()
			{	
				that.destroy();
			});

			//init get data
			that.getData("",function(_data)
			{
				that.draw(_data);
			});

			//submit click 
			$("input[name=submit]",this.node).click(function()
			{
				var path = $("input[name=path]",this.node).val();
				$("input.nowPathSet").val(path);
				that.destroy();
			});
			  
			return this;
		},

		getData = function(_path,_callBack)
		{
			var apiUrl = "sysSupplierConfig/listLocalDir";
			if(typeof _path != "undefined")
				apiUrl += _path;

			elucia.rest.get(
			{
				url: apiUrl,
				success: function(_data) 
				{						
					if(_data.result == 1)
					{
						_callBack(_data.data);
					}
				}
			});
		},

		draw = function(_data)
		{
			var ul = $("<ul>");
			for(var key in _data.childen_dir)
			{
				var li = $("<li>").addClass("folderClose");
				$("<a>").html(_data.childen_dir[key]).appendTo(li);		

				ul.append(li);	
			}

			$("div.content",that.node).html(ul);
			this.rootPath = _data.parent_dir;
			setPath(this.rootPath);
			folderClick();			
		},

		setPath = function(_path)
		{
			$("div.path input[name=path]").val(_path);
		},

		folderClick = function()
		{
			//set click
			$("li",that.node).unbind("click").click(function()
			{
				if($(this).hasClass("folderOpen"))
				{
					// console.log("close");
					if($(this).children("ul").length > 0)
					{
						$(this).children("ul").slideUp(function()
						{
							$(this).remove();
						});
					}				

					$(this).removeClass("folderOpen").addClass("folderClose");	
				}				
				else
				{
					// console.log("open");
					$(this).children("ul").slideDown();
					$(this).removeClass("folderClose").addClass("folderOpen");

					var nowPath = $(this).children("a").text();				
					that.update($(this));
				}
					
				return false;
			});
		},

		update = function(_liObj)
		{
			var path = [],check = false,pathString="";
			search = function(_thisObj)
			{	
				if(_thisObj.parent().parent("li").length > 0)
				{	
					// console.log("child");
					path.push(_thisObj.children("a").text());
					search(_thisObj.parent().parent("li"));
				}
				else
				{
					// console.log("mother");
					path.push(_thisObj.children("a").text());
					check = true;
				}			
			}

			//start
			search(_liObj);

			//wait
			while(!check){}

			//handle array 
			path.reverse();		
			pathString = path.join("/");

			//set input path
			setPath(this.rootPath+pathString);
			
			getData(this.rootPath+pathString,function(_data)
			{
				if(_data.childen_dir.length > 0)
				{
					// _liObj.removeClass("folderClose").addClass("folderOpen");
					var ul = $("<ul>").hide();
					for(var key in _data.childen_dir)
					{
						var li = $("<li>").addClass("folderClose");
						$("<a>").html(_data.childen_dir[key]).appendTo(li);		

						ul.append(li);	
					}

					_liObj.append(ul).children("ul").slideDown();
					folderClick();			
				}		
			});

		},

		destroy = function() 
		{
			var that = this;
			$("div.shadow",this.node.parent().parent()).hide();
			
			$(this.node).parent().css("left","45%").animate({top: -500},function()
			{	
				that.node.remove();
			});		
		},

		that = 
		{
			init: init,
			getData:getData,
			setPath:setPath,
			draw:draw,
			update:update,
			destroy: destroy
		};

		return that;
	}

	return sysSupplierCofMenuBackupListDir;
});