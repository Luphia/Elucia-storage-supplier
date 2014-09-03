define(function() {
	var Application = function() {
/*
	this.data
	this.node
*/
		var node,
			data,
      root = "meta",

		init = function(_node, _data) {
			this.node = _node;
			this.data = _data;
      if (_data.name.length >= 18) {
          $('div.name', _node).prop('title',_data.name);
          $('div.name', _node).text(_data.name.slice(0,15).concat('...'));
      }
      else 
          $("div.name", _node).text(_data.name);
      $("div.path", _node).text(_data.path);
      
      $("div.name", _node).click(function() {
          var virtual_path = $(this).parent().children("div.path").text(),
              actual_path = "./".concat( root + '/' + virtual_path );

          getData( actual_path, this );
			});

      $("div.name", _node).hover(function() {
          $(this).addClass('hover');
      }, function() {
          $(this).removeClass('hover');
      });

      var deg = 0;
      $("div#indicator", _node).click(function() {
        if(deg==0) {
          deg = 90;
          rotate( this, deg );
          openFolder( this );
        }
        else {
          deg = 0;
          rotate( this, deg );
          closeFolder( this );
        }
      });

			return this;
		},

		getData = function( fileUrl, _element ) {     
        var fileWidget = {
          "name": "browser.file",
          "data": []
        };
      
        elucia.addTo(fileWidget, "", function( _callbackNode, _callbackData, _obj ){
            _obj.addData( fileUrl );
            selected( _element );
        });
        return true;
    },

    openFolder = function( folderIcon ) {
        $(folderIcon).parent().children("div.folder").css("display","inline");
    },
    
    closeFolder = function( folderIcon ) {
        $(folderIcon).parent().children("div.folder").css("display","none");
    },
    
    rotate = function( _object, _deg ) {
        $(_object).css("transform","rotate(" + _deg + "deg)");
    },

    selected = function( _object ) {
        $('div.list div.folder div.name').removeClass('selected');
        $(_object).addClass('selected');
    },

		updateData = function() {
      elucia.debug("### appliaction.updateData ###");
		},

		destroy = function() {
			elucia.debug("### appliaction.destroy ###");
		},

		that = {
			init: init,
			getData: getData,
			updateData: updateData,
			destroy: destroy
		};

		return that;
	};

	return Application;
});