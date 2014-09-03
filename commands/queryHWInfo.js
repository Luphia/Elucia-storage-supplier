
module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},

	// ÀË¬d VM
	execute = function(_data, callBack){
		console.log("####### in function queryHWInfo ######## ");
		var period_start = _data.period_start;
		var period_end = _data.period_end;
		
		var file = "./" + "info.db";
		var sqlite3 = require("sqlite3").verbose();
		var db = new sqlite3.Database(file);
[
		// serialize query
		db.serialize(function() {
			// create table if not exist
			var now = parseInt(Date.now() / 1000);
			
			console.log("#### 1");

			// get hwinfo
			var sql = "SELECT * FROM hwinfo ";
			sql    += "WHERE checktime > " + period_start + " AND ";
			sql    += "checktime < " + period_end;
			console.log(sql);

			db.each(sql, function(err, row) {
				//console.log(row.id + " : " + row.checktime + " : " + row.hostname + " : " + row.platform + " : " + row.disk_usage);
				if(err){
					_data._result = {
						"result" : 0, 
						"message" : "query db fail: " + err, 
						"data" : ""
					};						
				}
				
				_data._result.data[row.id] = {
					"checktime" : row.checktime,
					"hostname" : row.hostname,
					"platform" : row.platform,
					"cpu_usage" : row.cpu_usage,
					"mem_total" : row.mem_total,
					"mem_usage" : row.mem_usage,
					"disk_total" : row.disk_total,
					"disk_usage" : row.disk_usage,
					"rx_bytes" : row.rx_bytes,
					"tx_bytes" : row.tx_bytes,
					"used_space" : row.used_space			
				}
				
				_data._result.result = 1;
				_data._result.message = "query succ";		
				
			});
			
			console.log(_data._result);
			callBack(false,job);
		});

		db.close();	
	},
	
	
	that = {
		init: init,
		execute: execute
	};
	return that;		
}	
	