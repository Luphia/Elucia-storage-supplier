
module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},

	// ¿À¨d VM
	execute = function(_data, callBack){
		//console.log("####### in function getHWInfo ######## ");
		var todo = 5;	
		// get config
		var serverIP = _data._config.serverIP;
		var storageDevice = _data._config.storageDevice;

		// get disk usage
		var exec = require('child_process').exec;
		//console.log(drive);
		exec('df --total |grep total', function (error, stdout, stderr){
			if (error !== null) {  
			   console.log('exec error: ' + error);  
			}else{
				tmp = stdout.split(/\s+/); 
				_data._result.data.total_disk = parseInt(tmp[1]) * 1024 ;						
				_data._result.data.usage_disk = parseInt(tmp[2]) * 1024;
				_data._result.data.free_disk = parseInt(tmp[3]) * 1024;
				
			}
			
			//console.log("### getDisk ");
			
			// get os info
			var os = require('os');
			_data._result.data.hostname = os.hostname();
			_data._result.data.platform = os.platform();
			_data._result.data.uptime = os.uptime();
			_data._result.data.loadavg = os.loadavg();
			_data._result.data.totalmem = os.totalmem();
			_data._result.data.freemem = os.freemem();
			_data._result.data.usagemem = os.totalmem() - os.freemem();
			//_data._result.data.cpus = os.cpus();
			_data._result.data.networkInterfaces = os.networkInterfaces();

			// get cpu
			
			
			
			// var proc = require('getrusage');
			// console.log(proc.usage());          // Run "man getrusage" for fields.
			// console.log(proc.getcputime());     // User time + system time.
			// console.log(proc.getsystemtime());  // System time.			
			// var libCpuUsage = require( 'cpu-usage' );

			// libCpuUsage( 5000, function( load ) {
				// //process.stdout.write( "\r" + load + "%   " );
				// console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@2");
				// console.log(load);
				// console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@2");
				// _data._result.data.cpu = load;
			// } );			
			
			// var cpus = os.cpus();
			// for(var i = 0, len = cpus.length; i < len; i++) {
				// console.log("CPU %s:", i);
				// var cpu = cpus[i], total = 0;
				// for(type in cpu.times)
					// total += cpu.times[type];

				// for(type in cpu.times)
					// console.log("\t", type, Math.round(100 * cpu.times[type] / total));
			// }
			
			// get cpu usage
			// var proc = require('getrusage'); //User time + system time.
			// _data._result.data.cpu = proc.getcputime();		

			todo --;
			doCallBack();			

		});	

		// get cpu
		var exec = require('child_process').exec;
		exec('sar -u 1 2 | tail -1 | awk \'{print $8}\' | cut -d. -f1', function (error, stdout, stderr){
		//exec('mpstat | awk \'$12 ~ /[0-9.]+\/ { print 100 - $12 }\'', function (error, stdout, stderr){
			_data._result.data.cpu = 100 - stdout.trim();	
			//console.log("cpu :");
			//console.log(stdout.trim());
			todo --;
			doCallBack();				
		});	
		
		
		// get rx bytes
		var exec = require('child_process').exec;
		exec('/sbin/ifconfig eth0 | grep "RX bytes" | cut -d: -f 2 | awk \'\{ print \$1\}\'', function (error, stdout, stderr){
			_data._result.data.rx_bytes = stdout.trim();
			// get tx bytes
			var exec = require('child_process').exec;
			exec('/sbin/ifconfig eth0 | grep "RX bytes" | cut -d: -f 3 | awk \'\{ print \$1\}\'', function (error, stdout, stderr){
				_data._result.data.tx_bytes = stdout.trim();
					//console.log(_data._result.data);
					//callBack(false,job);
					todo --;
					doCallBack();					
			});	
			
		});	
		
		
		// get used space in folder		
		var exec = require('child_process').exec;
		var cmd_du = 'du -b ' + _data._config.uploadPath + ' | grep -o \'\[0\-9\]\*\'';
		exec(cmd_du, function (error, stdout, stderr){
			_data._result.data.used_space = stdout.trim();
			todo --;
			doCallBack();								
		});	

		// get current connections		
		var exec = require('child_process').exec;
		exec('netstat -an | grep ESTABLISHED | grep ' + _data._config.communicationPort + ' | wc -l', function (error, stdout, stderr){
			_data._result.data.sessions = stdout.trim();
			todo --;
			doCallBack();								
		});			
		
		
		var doCallBack = function(){
			
			if(todo == 0) {
				//console.log(_data._result);
				_data._result.result = 1;
				_data._result.message = "get data succ";
				callBack(false,job);
			}
		}		
		
			
	},
	
	
	that = {
		init: init,
		execute: execute
	};
	return that;		
}	
	