
module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},

	// ¿À¨d VM
	execute = function(_data, callBack){
		console.log("####### in function storeHWInfo ######## ");
		
		var fs = require("fs");
		var file = "./" + "info.db";
		var exists = fs.existsSync(file);
		
		// create db file if not exist
		if(!exists) {
		  console.log("Creating DB file.");
		  fs.openSync(file, "w");
		  console.log("openSync");
		}
		
		var sqlite3 = require("sqlite3").verbose();
		var db = new sqlite3.Database(file);

		db.serialize(function() {
			// create table if not exist
			var now = parseInt(Date.now() / 1000);
			
			console.log("#### 1");
			if(!exists) {
				console.log("CREATE TABLE");
				var createTable = "CREATE TABLE hwinfo(  "
				createTable    += "id INTEGER PRIMARY KEY AUTOINCREMENT,checktime INTEGER,platform TEXT,";
				createTable    += "hostname TEXT, cpu_usage TEXT, mem_total INTEGER, ";
				createTable    += "mem_usage INTEGER, disk_total INTEGER, disk_usage INTEGER, ";
				createTable    += "rx_bytes INTEGER, tx_bytes INTEGER, used_space INTEGER, ";
				createTable    += "sessions INTEGER";
				createTable    += ");";
				console.log(createTable);
				db.run(createTable);
			}
			console.log("#### 2");
			//console.log(_data._result.data);
			
			insertSQL  = "INSERT INTO hwinfo(checktime,hostname,platform,cpu_usage,mem_total,mem_usage,disk_total,disk_usage,rx_bytes,tx_bytes,used_space,sessions) "; 
			insertSQL += "VALUES (" + now + ",'"+ _data._result.data.hostname + "','" + _data._result.data.platform;
			insertSQL += "','" + _data._result.data.cpu + "'," + _data._result.data.totalmem + "," + _data._result.data.usagemem;
			insertSQL += "," + _data._result.data.total_disk + "," + _data._result.data.usage_disk;
			insertSQL += "," + _data._result.data.rx_bytes + "," + _data._result.data.tx_bytes;
			insertSQL += "," + _data._result.data.used_space + "," + _data._result.data.sessions;
			insertSQL += ")";

			console.log(insertSQL);
			
			var stmt = db.prepare(insertSQL);
			stmt.run();
			console.log("#### 3");

			stmt.finalize();
			
			// db.each("SELECT * FROM hwinfo", function(err, row) {
				// console.log(row.id + " : " + row.checktime + " : " + row.hostname + " : " + row.platform + " : " + row.disk_usage + " : " + row.rx_bytes + " : " + row.tx_bytes);
			// });
			
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
	