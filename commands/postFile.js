
module.exports = {
	posturl: function(option, token, file_path, callBack) {
		console.log("####### in function postFile ######## ");
//req.session.loginData.token
		// post file
		//curl http://10.10.21.95:3000/file/dir/text1.txt -H "Authorization:Bearer 22fe301b2a2b3d3b131f77850dd81ee17ba3af495fa2d7c4af4e20b247f67c23" -F myfile=@"./test1.txt"
		var exec = require('child_process').exec;
		var publicIP;
		var post_url;

		if(option && typeof(option) == "object") {
			post_url = option.post_url;
			publicIP = option.publicIP;
		}
		else {
			post_url = option;
		}

		exec('curl ' + post_url + ' -H "Authorization:Bearer ' + token + '" -F myfile=@"' + file_path + '"', function (error, stdout, stderr){
			console.log(stdout.trim());

			callBack(stdout);			
		});		
}