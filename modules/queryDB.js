/*
*	function module.queryDB
*	@input _sql
*	@input _config
*   @input _callBack
*/


module.exports =  function(){
	queryDB = function(_sql, _config, _callBack)
	{
	console.log(_config);
		var pg = require("pg");
	//console.log("queryDB require pg");
		var	conString = "pg://"+_config.db.user+":"+_config.db.password+"@"+_config.db.host+":"+_config.db.port+"/"+_config.db.database;
	//console.log("queryDB conString");
		var	client = new pg.Client(conString);
		
	//console.log("queryDB build client");
		client.connect(function(err, results) {  
		     if(err){  
	            console.log('dbConnectReady Error: ' + err.message);  
	            client.end();  

	            _callBack(err);
	            return;  
		     }  

		     console.log("db connect OK");  
		});  

		client.query(_sql, function(err,results){
			if(err){
				console.log(err);
				_callBack(err);
			}
			else{
				_callBack(false,results);
			}			
		});	
		
		client.on('end', function() { 
			client.end();
		});
	},

	that = {
		queryDB: queryDB
	};
	return that;
};