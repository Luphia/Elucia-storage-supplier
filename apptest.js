
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , fs = require('fs')
  , path = require('path')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , os = require('os')
  , util = require('util')
  , commands = require('./modules/cmdqueue.js')
  , storage = require('./modules/keyvaluestore.js')
  , procedure = require('./modules/procedure.js')
  , io
  , server 
  , config = require('./config/config.json')
  , filter = require("./controller/Filter").init(commands, storage, config)
  , uploadController = require('./controller/Upload.js').init(commands, storage, config)
  , downloadController = require('./controller/Download.js').init(commands, storage, config)
  , updateController = require('./controller/Update.js').init(commands, storage, config)
  , hwinfoController= require('./controller/HWInfoCol.js').init(commands, storage, config)
  //, syncinfoController = require('./controller/SyncInfo.js').init(commands, storage, config)
  , fake = require("./controller/FakeData").init(commands, storage, config)
  , JobPublisher = require('./modules/jobpublisher');//.init(commands, storage, config);	// need to setup rabbitmq


// prevent crash
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

// console.log(JSON.stringify(config));
var app = express();


app.configure(function(){
  app.set('port', process.env.PORT || 3001);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //app.use(express.favicon(__dirname + '/public/images/favicon.png'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('A word for XXX'));
  app.use(express.session({secret: "A word for XXX"}));
  app.use(filter.userEnter);
  app.use(express.bodyParser({ // upload func
      uploadDir:__dirname + '/public/upload',
	  keepExtensions: true,
	  limit: 100000000, // 100M limit
	  defer: true  //enable event           
  }));  
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// app.get('/', routes.index);
app.get('/fake/*', fake.get);


// upload function
// paramter key:
// upload_file_name
app.post('/file/*', uploadController.post);

// download function
// raw body:
// {"client_id":13,"token":"this_is_a_test_token","partition_file_name":"test.txt"}
//app.post('/download/*', downloadController.post);
app.get('/file/*', downloadController.get);

// update function
// request payload:
// client_id:13,token:this_is_a_test_token,partition_file_name:123.part1
//app.post('/file/*', updateController.post);

// sync info
//app.post('/sync', syncinfoController.post);
//var sync = require("./controller/SyncInfo").init(commands, storage, config);
//sync.sync2center();

// hwinfo query
// app.get('/hwinfo', hwinfoController.get);

// supplier monitor
// var supplierMonitorCollector = require("./controller/SupplierMonitorCollector").init(commands, storage, config);
// supplierMonitorCollector.monitor();

// send Heartbeat 
var HeartBeat = require("./controller/HeartBeat").init(commands, storage, config);
HeartBeat.sendHeartBeat();

// hw info collection
// var hwinfo = require("./controller/HWInfoCol").init(commands, storage, config);
// hwinfo.collectInfo();

//config
app.get('/config', function(_req, _res) {
  var tmpCFG = {};
  _res.send(JSON.stringify(tmpCFG));
});

app.get('/command/*', require("./controller/CommandOperator").init(commands).get );
app.del('/command/*', require("./controller/CommandOperator").init(commands).delete );



server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


//################################# test upload file #########################################
request = require('request-json');
var client = request.newClient('http://localhost:3000/');

// data = {
  // client_id:13,
  // partition_file_name:"test2.txt",
  // token:"this_is_a_test_token",
// };
// client.sendFile('/upload/dir1/dir2/dir3', 'waiting/test3.txt', data, function(err, res, body) {
  // if (err) {
    // return console.log(err);
  // }
// });

// client.saveFile('attachments/test.png', './test-get.png', function(err, res, body) {
  // if (err) {
    // return console.log(err);
  // }
// });

//################################# test #########################################