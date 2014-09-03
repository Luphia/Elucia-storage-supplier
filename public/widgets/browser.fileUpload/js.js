// JavaScript Document
define(function() {
    var Application = function() {
        var node,
            data,
            todo,
            
        init = function(_node,_data) {
            node = _node;
            this.data = _data;
            todo = _data.length;
            
            var virtual_path = $("div.browser div.operate div.nav div#path").text();
                
            virtual_path = virtual_path.slice(1);

            for (var i = 0; i < _data.length; i++) {
                var reader = new FileReader(),
                    formData = new FormData();

                // 檢查上傳的檔案是否為資料夾
                // 若為資料夾，則創造一個內容為空的同名資料夾
                // 目前無法得知檔案類型，原因尚未得知
                if(_data[i].type == "" && _data[i].size == 0) {
                    var type = "folder";

                    if( findSameName( _data[i].name, type ) ) {
                        var tmpNmae = _data[i].name;

                        elucia.confirm("上傳資料夾"+tmpNmae+"失敗，資料夾名稱衝突!", {
                            "ok": function() {
                                todo--;
                                if (todo == 0) destroy();
                            },
                            "cancel": function() {
                                todo--;
                                if (todo == 0) destroy();
                            }
                        });
                    }
                    else {
                        var fileUrl = virtual_path + _data[i].name + '/';

                        postMetadata( _data[i], fileUrl );
                    }                      
                }
                else {
                    var type = _data[i].type,
                        fileUrl = virtual_path + _data[i].name;

                    if( findSameName( _data[i].name, type ) ) {
                        var tmpData = _data[i];
                        elucia.confirm("檔案名稱"+tmpData.name+"相同，是否覆蓋檔案？", {
                            "ok": function() {
                                formData.append('myfile', tmpData);
                                putXHR( formData, fileUrl );
                            },
                            "cancel": function() {
                                todo--;
                                if (todo == 0) destroy();
                            }
                        }); // end of confirm
                    }
                    else {
                        postXHR( _data[i], fileUrl );
                    }
                    /*
                    reader.onload = function(event) {
                        formData.append('file', event.target.result);
                        postXHR( formData, fileUrl );
                    };
                    */

                    // reader.readAsDataURL(_data[i]);
                }
            } // end of for loop
            
            return this;
        },

        addFileToContent = function( _data, _type, _url ) {
            var dt = new Date(_data.lastModifiedDate),
                tmpWidget = {
                    "name": "browser.file",
                    "data": {
                        "name": _data.name,
                        "date": dt.getTime()/1000,
                        "type": _type,
                        "size": _data.size,
                        "path": _url
                    }
                };

            elucia.addTo( tmpWidget, node.parent(), function(_callbackNode, _callbackData, _obj) {
                _obj.setViewModel();
                todo--;
                if (todo == 0) destroy();
            });          
        },

        addListToContent = function( _data, _url ) {
            var parent = getParentPath(),
                listWidget = {
                    "name": "browser.list",
                    "data": {
                        "name": _data.name,
                        "path": _url
                    }
                };

            if (typeof parent == 'undefined')
                return;
            else {
                // 檢查父層資料夾原先是否有資料夾
                // 若沒有，則在父層新增"可開啟子資料夾"圖示
                if (!parent.children('div#indicator').hasClass('indicator'))
                    parent.children('div#indicator').addClass('indicator');
                elucia.addTo( listWidget, parent, function() {
                    addFileToContent( _data, "folder", _url );
                });
            }
        },

        findSameName = function( _name, _type ) {
            var divFile = "div.browser div.content div#file";
            for(var i = 0;i < $(divFile).length;i++) {
                var fileType = $(divFile + " div.type:eq("+i+")").text();
                var fileName = $(divFile + " div.name:eq("+i+")").text();
                if( fileType == _type && fileName == _name ) {
                    return true;
                }
            }
            return false;
        },

        getParentPath = function() {
            // 此函式功能為在資料夾樹狀結構清單中找出上層資料夾路徑
            // 藉由這個路徑得知樹狀清單中的上層資料夾
            var divBrowser = node.parent().parent(),
                divNav = divBrowser.children('div.operate').children('div.nav'),
                curr_path = divNav.children('div#path').text();

            curr_path = curr_path.slice(1);
            if (typeof curr_path == 'undefined' || curr_path == null)
                return divBrowser.children('div.list').children('div.folder');
            else {
                var divFolder = divBrowser.find('div.path').filter(function() {
                        return $(this).text() === curr_path; 
                    }).parent();

                return divFolder;
            }
        },

        postMetadata = function( _data, _url) {
            var metaUrl = "./meta/";

            elucia.rest.post({
                'url': metaUrl.concat(_url),
                success: function( _res ) {
                    if (_res.result == 1)
                        addListToContent( _data, _url );
                }
            });
        },

        postXHR = function( _data, _dir ) {
            var xhr = new XMLHttpRequest(),
                formData = new FormData(),
                progress = document.createElement('progress');

            xhr.open('POST', './file/' + _dir);
            xhr.setRequestHeader('Authorization', 'Bearer ' + configuration.user.token);
            progress.min = 0;
            progress.max = 100;
            progress.value = 0;
            node.append(progress);

            xhr.onload = function() {
                elucia.debug('xhr upload done.');
                progress.remove();
                addFileToContent( _data, _data.type, _dir );
            };
            
            if ("upload" in new XMLHttpRequest) {
                elucia.debug('xhr new upload');
                xhr.upload.onprogress = function (event) {
                    if (event.lengthComputable) {
                        var complete = (event.loaded / event.total * 100 | 0);
                        progress.value = complete;
                    }
                }       
            }
            
            formData.append('myfile', _data);
            xhr.send(formData);
        },

        putXHR = function( _data, _dir ) {
            var xhr = new XMLHttpRequest(),
                formData = new FormData();

            xhr.open('PUT', './file/' + _dir);
            xhr.setRequestHeader('Authorization', 'Bearer ' + configuration.user.token);

            xhr.onload = function() {
                elucia.debug('put xhr upload done.');
                todo--;
                if (todo == 0) destroy();
            };

            formData.append('myfile', _data);
            xhr.send(_data);
        },

        destroy = function() {
            elucia.debug("### fileUpload.destroy ###");
            node.remove();
        },
        
        that = {
            init: init,
            destroy: destroy
        };
        
        return that;
    };
    
    return Application;
});