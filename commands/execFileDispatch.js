module.exports = function()
{
	var job
	,	myCallBack = function() {}
	,

	init = function(_job)
	{
		job = _job;
		return this;
	},

	execute = function(_data, _callBack)
	{
		console.log("####### in function execFileDispatch ######## ");
		
		// get dispatch info
		//var url = "http://" + _data._config.serverIP + ":3000/";
		var url = "http://" + _data._config.serverIP + ":" + _data._config.communicationPort + "/";
		var file_path = "exec/" + "replication/" + _data.client_id + "/"  + _data.partition_file_path;
		file_path = encodeURI(file_path);
		request = require('request-json');
		var client = request.newClient(url);
		var dispatchPath = {};
		// console.log(url);
		console.log(file_path);
		
		// 不等待，直接 callback
		_callBack(false, job);	
		
		client.get(file_path, function(err, res, body) {
			
			//return console.log(body.rows[0].title);
			if(err){
				console.log("get dispatch path err");
				//_callBack(false, job);
			}else{
				//console.log(body);
				//console.log(res.body);
				var result = JSON.parse(res.body);
				dispatchPath = result.data.to;
				console.log("############## dispatchPath");
				//console.log(result);
				// dispatch file to supplier
				var isEmpty = 0;
				for(var key in dispatchPath) {					
					//console.log("send to : " + dispatchPath[key]);
					isEmpty = 1;
					var postFile = _data.file_info;
					var postFileInfo = postFile[_data.partition_file_name];

					//curl -H "Authorization:Bearer 4e3254db8fb5d6edfa23d116a4bff5cd1c674d204ec8ec2a36806a8503db4331" 
					//--request POST -F file=@./test.txt --location http://10.10.20.96:3000/file/dirxx/test.abcccccccdefg

					// exec curl		
					var exec = require('child_process').exec,
						token = "Authorization:" + "Bearer " + _data.token,
						path = postFileInfo.path,
						url = "'" + encodeURI(dispatchPath[key]) + "'";
						//url = "'" + dispatchPath[key] + "'";
						
					var command = "curl -H \'" + token + "\' --request POST -F file=@" + path + " --location " + url;
					console.log(command);
					exec(command, function (error, stdout, stderr){
						console.log(stdout.trim());
							
					});						

					
				}
				if(isEmpty == 0){
					console.log("############## Get empty dispatchPath from Center");
				}					
				//_callBack(false, job);
			}
		});

	},

	that = 
	{
		init: init,
		execute: execute
	};

	return that;
}