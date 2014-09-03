  define(function() {
	var Application = function() {
/*
	this.data
	this.node
*/
		var node,
        data,
        root = "meta",

		init = function( _node, _data ) {
			node = _node;
			data = _data;

            if( typeof(_data) == "undefined" || _data == null )
                return;
            else {
                initialData( _node, _data ); // 初始化參數，將檔案的詳細資料寫入各個div tag
            }
      
            _node.click(function() {
                $("div#file").removeClass("selected");
                $(this).addClass("selected");
            });
      
            _node.hover(
                function() {
                    $(this).addClass('hover');
                }, function() {
                    $(this).removeClass('hover');
                }
            );
      
            _node.keyup(function(event) {
                if( event.which == 46 ) {
                    confirmDelete( _node );
                }
            });

            $("div.name", _node).hover(
                function() {
                    $(this).addClass("underline");
                }, function() {
                    $(this).removeClass("underline");
                }
            );

            $("div.name", _node).click(function() {
                getData( _node );
            });
      
            $("div#icon", _node).click(function() {
                getData( _node );
	        });

			return this;
		},
    
    initialData = function( _node, _data ) {
        var dt = new Date(_data.date*1000);

        if( _data.type == "folder" )
            $("div#icon", _node).addClass("folderIcon");
        else
            $("div#icon", _node).addClass("fileIcon");

        $("div.name", _node).text(_data.name).trunk8();
        $("div.date", _node).text(dt.toLocaleString());
        $("div.msecond", _node).text(_data.date);
        $("div.type", _node).text(_data.type);
        $("div.size", _node).text(_data.size);
        $("div.path", _node).text(_data.path).trunk8();    
    },

    getData = function( _node ) {
        var name = $("div.name", _node).text();
        var type = $("div.type", _node).text();
        var path = $("div.path", _node).text();
      
        if( type == "folder" ) {
            addData( "./" + root + '/' + path );
        }  
        else {
            fileDownload( path );
        }
    },

    addData = function( folder ) {      
        $("div.browser div.content").empty();
        $("div.browser div.operate div#path").text( folder.slice(2+root.length) );
        $("div.browser div.list div.folder div.name").removeClass('selected');
      
        elucia.rest.get({
			url: folder,
			success: function(_data) {
            var tmpData = _data.data.files,
				fileCounter = 0; // 計算有多少筆檔案已加入 content
          
                for(var key in tmpData) {
                    var tmpWidget = {
			 	 	    "name": "browser.file",
			 	 	    "data": tmpData[key]
			 	    };

			 	    elucia.addTo(tmpWidget, $("div.browser div.content"), function() {
                        fileCounter++;
                        // 若所有檔案皆已加入 content ，則調整檢視模式
                        if( fileCounter == tmpData.length ) {
                            $('div.browser')
                                .children('div.table')
                                .children('div.tr_name')
                                .children('div.sort')
                                .children('div.icon').click();

                            setViewModel();
                        }                                
                    });
			    } // enod of for loop

                if (tmpData.length == 0) {
                    var text = $("<div class='text'>There is empty.</div>");
                    $('div.browser div.content').append(text);
                }
		    } // end of success function
		}); // end of elucia.rest.get

        return true;
    },

    confirmDelete = function( _data ) {
        var fileName = _data.children('div.name').text(),
            fileType = _data.children('div.type').text();

        if( fileType == 'folder' )
            fileType = '資料夾';
        else
            fileType = '檔案';
        elucia.confirm("是否刪除 " + fileName + ' ' + fileType + "？", {
            "ok": function() {
                deleteFile( _data );
            }
        });
    },

    deleteFile  = function( _data ) {
        var path = _data.children('div.path').text();
      
        elucia.rest.del({
            'url': './' + root + '/' + path,
            'Authorization': 'Bearer ' + configuration.user.token,
            success: function( _response ) {
                if( _response.result == 1 ) {
                    if (_data.children('div.type').text() == 'folder') {
                        deleteFolder( _data.children('div.path').text() );
                    }
                    destroy();
                }
                else
                    elucia.debug("File Delete Fail.");
            }
        });
    },

    deleteFolder = function( _path ) {
        if (typeof _path == 'undefined')
            return;
        else {
            var divPath = $('div.browser div.list div.folder div.path'),
                curr_path = $('div.browser div.operate div.nav div#path').text().slice(1);

            divPath.filter(function() {
                return $(this).text() === _path;
            }).parent().remove();

            if (countFolder() == 1) {
                divPath.filter(function() {
                    return $(this).text() === curr_path;
                }).parent().children('div#icon').removeClass('icon');
            }
        }
    },
 
    countFolder = function() {
        var count = node.parent().children('div#file').children('.folderIcon').length;
        return count;
    },

    fileDownload = function( _path ) {
        getActualpath( _path );
    },

    getActualpath = function( _path ) {
        if (typeof _path == 'undefined')
            return;
        else {
            elucia.rest.get({
                'url': './' + root + '/' + _path,
                success: function( _res ) {
                    if ( _res.data.realpath ) {
                        var widget = {
                            "name": "ProgressEvent",
                            "data": {
                                "width": 80,
                                "height": 80,
                                "fontSize": 12,
                                "url": _res.data.realpath
                            }
                        };
                        elucia.addTo( widget, $('div#icon', node) );

                        getFile( _res.data.realpath );
                    }
                    else {
                        elucia.debug('404 Not Found file path');
                    }
                }
            });
        }
    },

    getFile = function( _path ) {
        // xhr cross domain
        var xhr = new XMLHttpRequest();

        if ("withCredentials" in xhr) {
console.log('XHR2');
            xhr.open('GET', _path, true);
        }    
        // IE 8 & IE 9 不支援XHR2
        // IE 8 & IE 9 處理CORS問題只能使用XDomainRequest
        // 但是XDR限制多，Only GET or POST Method
        // The target URL must be accessed using the HTTP or HTTPS protocols.
        // No custom headers may be added to the request
        /*
        else if (typeof XDomainRequest != "undefined") {
            console.log('XDR');
            xhr = new XDomainRequest();
            xhr.open('GET', _path );
        }
        */
        
        xhr.setRequestHeader('Authorization', 'Bearer ' + configuration.user.token);
        xhr.responseType = "blob";
        xhr.onreadystatechange = function () { 
            if (xhr.readyState == 4) {
                var a = document.createElement('a'),
                    fileName = getFileName( _path );

                a.href = window.URL.createObjectURL(xhr.response);
                if (typeof fileName == 'undefined')
                    a.download = _path;
                else
                    a.download = fileName;
                a.click();
            }
        };

        xhr.send();
    },

    getFileName = function( _path ) {
        if (typeof _path == 'undefined')
            return;
        else {
            var lastIndex = _path.lastIndexOf('/');
            if (lastIndex == -1)
                return;
            else
                return _path.slice(lastIndex + 1);
        }
    },

    setViewModel = function() {
        elucia.debug("### setViewModel function ###");
        $('div.browser div.content div.text').remove();
        $('div.browser div.operate div.view div#icon').click().click();
        /*
        var tmpWidget = {
            "name": "browser.view",
            "data": $("div.browser div.operate div.view div.model").text()
        };

        elucia.addTo(tmpWidget, "", function( _callbackNode, _callbackData, _obj ) {;
            _obj.updateData( _obj.getData() );
        });
        */
    },

	destroy = function() {
		elucia.debug("### file.destroy ###");
        node.remove();
	},

	that = {
	    init: init,
        getData: getData,
        addData: addData,
        setViewModel: setViewModel,
	    destroy: destroy
	};

		return that;
	};

	return Application;
});