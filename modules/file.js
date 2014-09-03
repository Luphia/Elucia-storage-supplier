var uploadPath = ""
,   pattern1 = "_0000_"
,   pattern2 = "____zzzz____"
,   fs = require("fs")
;

module.exports = {
    init: function(_path) 
    {
        _path && (uploadPath = _path);
        return this;
    }
    ,   pathEncode: function(_url)
    {
        // return uploadPath + _url.replace(new RegExp(pattern1, "gm"), pattern2).replace(new RegExp("/", "gm"), pattern1);
        return uploadPath + new Buffer(_url).toString('hex');
    }
    ,   pathDecode: function(_url)
    {
        // return _url.replace(new RegExp(pattern1, "gm"), "/").replace(new RegExp(pattern2, "gm"), pattern1);
        return new Buffer(_url, 'hex').toString('utf8');
    }
    ,   readFileStream: function(_path) 
    {
        return fs.createReadStream(module.exports.pathEncode(_path));
    }
    ,   writeFileStream: function(_path)
    {
        return fs.createWriteStream(module.exports.pathEncode(_path));
    }
    ,   md5: function(_file, _callBack) {
        try {
            var filename = _file.path
            ,   crypto = require('crypto')
            ,   fs = require('fs')
            ,   md5sum = crypto.createHash('md5')
            ,   rs = fs.ReadStream(filename)

            rs.on('data', function(d) {
                md5sum.update(d);
            });

            rs.on('end', function() {
                var rtdata = md5sum.digest('hex');
                _callBack(false, rtdata);
            });
        }
        catch(e) {
			console.log(e);
            _callBack(e);
        }
    }
    ,   upload: function(_file, _path)
    {
        var ws = module.exports.writeFileStream(_path),
            rs = fs.createReadStream(_file.path);

			// limit speed
			// var Throttle = require('stream-throttle').Throttle;
			// var speed_limit = 100000000; // 1 mb/s
			// if(typeof(_file.upload_speed_limit) != "undefined"){
				// speed_limit =_file.upload_speed_limit;
			// }
			// console.log("###############################################");
			// console.log(speed_limit);
			// var opts = {
				// rate : speed_limit
			// }	
			
			//rs.pipe(new Throttle(opts)).pipe(ws);	
		
        rs.pipe(ws);
        //fs.unlink(_file.path);
    }
    ,   output: function(_stream, _path)
    {
		// ­­³t¤èªk
        // try {
			// var ws = _stream,
				// rs = module.exports.readFileStream(_path);
			
			// // limit speed
			// var Throttle = require('stream-throttle').Throttle;
			// var speed_limit = 100000000; // 1 mb/s
			// if(typeof(_stream.download_speed_limit) != "undefined"){
				// if(_stream.download_speed_limit == 0){
					// speed_limit = 1000000000000; // 10 G/s
				// }else{
					// speed_limit =_stream.download_speed_limit;
				// }				
			// }

			// console.log(speed_limit);
			// var opts = {
				// rate : speed_limit
			// }
			
			// rs.pipe(new Throttle(opts)).pipe(ws);		
        // }
        // catch(e) {
            // console.log(e);
        // }
        var ws = _stream,
        rs = module.exports.readFileStream(_path);
        rs.pipe(ws);	
    }
};