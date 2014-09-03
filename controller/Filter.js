var commands
	, storage
	, config
	, Token = require("../modules/token")
	, pattern = ['/file/']
	, enablePathPattern = ["/file/","/summary/summarySupplier/"]
	;

module.exports = {
	init: function(_commands,_storage,_config) {
		commands = _commands;
		storage = _storage;
		config = _config;
		Token = Token.init(_config);

		return this;
	}

	, userEnter: function(_req, _res, _next) {

//_req.connection.originalAddress = _req.connection.remoteAddress;
//_req.connection.remoteAddress = _req.headers['public-ip'];
        _req.connection.trustAddress = _req.headers['public-ip'];

		if(typeof(_req.session.loginData) == "undefined") {
	    	_req.session.loginData = {
	    		"clientId": -1
	    	};
    	}

    	var token, check = true;
    	_req.headers.authorization && ( token = _req.headers.authorization.split("Bearer ")[1]) || (token = "");
    	if(token.length > 5) {
    		tmpData = Token.decode(token);
    		_req.session.loginData = {
	    		"username": tmpData.username,
				"clientId": tmpData.clientId,
				"token": token,
				"ip": tmpData.ip
	    	};

	    	console.log(tmpData);
    	}

    	for(var key in pattern)
    	{
    		if(_req.originalUrl.indexOf(pattern[key]) == 0 && _req.session.loginData.clientId == -1) {
    			check = false;
    			break;
    		}
    	}
    	
    	if(!check) {
    		var rs = new require("../modules/jobResult")();
    		rs.setResult(-1);
    		rs.setMessage("No Promission");
    		_res.send(rs.toJSON());
    	}
    	else {
    		_next();
    	}
	}

	, checkSupplierStatus:function(_req, _res, _next)
	{
		var check = true;

		if(!config.enable)
		{
			for(var key in enablePathPattern)
	    	{
	    		if(_req.originalUrl.indexOf(enablePathPattern[key]) == 0 && _req.session.loginData.clientId == -1)
	    		{
	    			check = false;
	    			break;
	    		}
	    	}
	    	   
	    	if(!check) 
	    	{
	    		var rs = new require("../modules/jobResult")();
	    		rs.setResult(-1);
	    		rs.setMessage("No Promission");
	    		_res.send(rs.toJSON());
	    	}
	    	else 
	    	{
	    		_next();
	    	}
		}
		else	
		{
			_next();	
		}	
    }
	, checkAuth: function(_req, _res, _next) {

	},

	escapeXss : function(_req, _res, _next)
    {   
        escape = function(_object)
        {
            for(var key in _object)
            {
                if(typeof _object[key] == "object") 
                {
                     escape(_object[key]);
                }
                else if(typeof _object[key] == "string")
                {
                    _object[key] = _object[key].replace(/'/g,"&#39;");
                    _object[key] = _object[key].replace(/"/g,"&quot;");
                    _object[key] = _object[key].replace(/\\/g,"&#165");
                }   
            }           
        }

        escape(_req.body);
        _next();     
	}
}