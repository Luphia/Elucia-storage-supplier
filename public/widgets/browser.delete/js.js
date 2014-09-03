define(function() {
	var Application = function() {
		var node,
			data,

		init = function(_node, _data) {
			node = _node;
			this.data = _data;

			// 實作功能為刪除檔案
			$('div.icon', _node).click(function() {
				var file = _node.parent().parent().children('div.content').children('.selected');

				if(file.length == 0)
					elucia.msg("刪除檔案前，請先選擇一個檔案！");
				else {
					if(file.children('div.type').text() == 'folder')
						elucia.debug("尚未實作刪除資料夾");
					else {
						confirmDelete( file );
					}
				}
			})

			return this;
		},

		confirmDelete = function( _data ) {
			var fileName = _data.children('div.name').text();
			elucia.confirm("是否刪除"+fileName+"檔案？", function(event) {
                if(event) {
                    deleteFile( _data );
                }
            });
		},

		deleteFile = function( _data ) {
			var path = _data.children('div.path').text();
			
			elucia.rest.del({
        	    'url': './meta/' + path,
        	    'Authorization': 'Bearer ' + configuration.user.token,
        	    success: function( _response ) {
        	        if( _response.result == 1 ) {
        	        	elucia.debug("File Delete Success.");
        	        	_data.remove(); // 先暫時用 remove，若日後增加還原功能，可改用 display
        	        }
        	        else
        	        	elucia.debug("File Delete Fail.");
        	    }
        	});
        	// 還原功能
        	/*
        	elucia.rest.get({
				'url': './recovery/' + path,
				'Authorization': 'Bearer ' + configuration.user.token
			});
			*/
		},

		updateData = function(_data) {
			elucia.debug("### appliaction.updateData ###");
		},

		destroy = function() {
			elucia.debug("### appliaction.destroy ###");
		},

		that = {
			init: init,
			updateData: updateData,
			destroy: destroy
		};

		return that;
	};

	return Application;
});