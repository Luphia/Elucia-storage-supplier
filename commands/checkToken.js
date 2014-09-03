/* 測試
[ input ]	
	_data = {
		"client_id":"1",
		"token":"asdfawer2q4aedf",
		"partition_file_name":"123.part1"
	}
[ output(callback) ]
	_data = {
		
	}		
*/	


module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},

	// 檢查 VM
	execute = function(_data, callBack){
		console.log("####### in function checkToken ######## ");
		
		// 若是修復節點模式則不進行 token 檢查
		console.log(_data.isRepair);
		if(_data.isRepair == 1){
			_data.checkResult = 1;
			callBack(false,job);
			return;
		}

		var client_id = _data.client_id;
		var token = _data.token;
		var serverIP = _data._config.serverIP;
		
		// callBack
		var postData = function(data) {
			var dataParse = JSON.parse(data);
			if(dataParse.result == 1){
				_data.checkResult = 1;
				_data._result.message ="token auth succ";
				_data._result.check_result = 1;
				_data._result.data = dataParse.data;
			}else{
				var sendIP = _data._config.serverIP + ":" + _data._config.communicationPort;
				require("../modules/log2Server.js").send(sendIP, _data.client_id, 2, "[checkToken] token auth fail", _data._config.publicIP);
				_data.checkResult = 0;
				_data._result.message ="token auth fail";
				_data._result.check_result = 0;
				_data._result.data = dataParse.data;				
			}
			console.log("### rece data:" +  _data._result.data);
			console.log("### check token:" +  _data.checkResult);
			//_data.checkResult = 1;
			
			callBack(false,job);		
		}

		var params = {
			"token":token,
			"action":{
				"type":"folder",
				"method":_data.method,
				"path":_data.partition_file_path
			}
		}
		
		// post to Center
		var sendIP = _data._config.serverIP + ":" + _data._config.communicationPort;
		var post = require( './postURL.js' );
		try{
			var actions = {
				"action": "checkToken",
				"publicIP": _data._config.publicIP
			};
			post.posturl(actions, "", sendIP, params, postData);
		}catch(e){
			callBack(e);
		}		
		
		// var	sql = "SELECT * FROM client_token ";
		// sql    += "WHERE token = '" + token + "' AND ";
		// sql    += "client_id = " + client_id;
		// console.log(sql);
		
		// try {
			// // exec sql
			// console.log("in sql start");
			// var cDb = require("../modules/queryDB.js");
			// db = new cDb().queryDB(sql,_data._config,function(err,result){
				// console.log("in sql here");
				// if(!err){
					// console.log("in sql succ");
					// // if get result
					// if(result.rowCount == 1){
						// // controller use
						// _data.expire_time = result.rows[0].expire_time;

						// var now = Date.now() / 1000;
						
						// if(now < _data.expire_time){
							// // succc
							// _data.checkResult = 1;
							
							// _data._result.message ="token auth succ";
							// _data._result.check_result = 1;
							// _data._result.data.rows = result.rows;					
						// }else{
							// // fail
							// _data.checkResult = 0;
							
							// _data._result.message ="token auth fail";
							// _data._result.check_result = 0;
							// _data._result.data.rows = result.rows;						
						// }
					// }else{
						// _data.checkResult = 0;
						// _data._result.message = "token auth fail";
						// _data._result.check_result = 0;
						
					// }	
					// console.log(_data._result.message);
					// callBack(false, job);																
				// }	
				// else{
					// console.log("in sql err");
					// // controller
					// _data.checkResult = 0;
					// // fill out result
					// _data._result.message ="token auth error";
					// _data._result.check_result = 0;
					// _data._result.data.err = err;

					// throw err;
				// }
						
			// });
			
		// }
		// catch(e){
			// _callBack(e);
		// }
	
	},
	
	
	that = {
		init: init,
		execute: execute
	};
	return that;		
}	
	