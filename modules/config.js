module.exports = function()
{
	var nconf = require('nconf'),

	init = function( _path, _defaultPath, _callback )
	{
		var fs = require('fs'),
			checkExist = "",
			pathDefault = _defaultPath,
			path = _path;

		//check file exist
		checkExist = fs.existsSync(path);	
		if(!checkExist)
		{
			//copy default to new 
			var readable = fs.createReadStream(pathDefault),
		    	writable = fs.createWriteStream(path);
		    readable.pipe(writable);
		    readable.on('end', function() {
  				console.log("initial config success.");
		    	nconf.argv().env().file({ "file": path });
		    	_callback && _callback();
			});
		}	
		else
		{
			console.log("config exist.");
			nconf.argv().env().file({ "file": path });
			_callback && _callback();	
		}
	},

	// 判斷是否傳入參數 _value，若有執行 set；沒有則執行 get
	// 參數 _key 可以為 parent.children or parent:children
	attr = function( _key, _value )
	{
		var key = _key.replace(".", ":");
		if (typeof _value == 'undefined' || _value == null)
			return getAttrValue(key);
		else
			setAttrValue(key, _value);				
	},

	getAttrValue = function( _key ) {
		return nconf.get(_key);
	},

	save = function( _callback )
	{
		nconf.save(function(err)
  		{
  			if(err) {
  				console.log(err);
  				callback && _callback(err);
  			}
  			else
  				_callback && _callback();
  		});
	},

	setAttrValue = function( _key, _value ) {
		nconf.set(_key, _value);
	},

	that = 
	{
		init: init,
		attr: attr,
		save: save
	};

	return that;
}