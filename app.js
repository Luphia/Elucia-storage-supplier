
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
  , log4js = require('log4js')
  , chokidar = require('chokidar')
  , config = require('./config/config.json')
  , filter = require("./controller/Filter").init(commands, storage, config)
  , loginController = require('./controller/Login').init(commands, storage, config)
  , fileController = require('./controller/File').init(commands, storage, config)
  , uploadController = require('./controller/Upload.js').init(commands, storage, config)
  , downloadController = require('./controller/Download.js').init(commands, storage, config)
  , updateController = require('./controller/Update.js').init(commands, storage, config)
  , hwinfoController = require('./controller/HWInfoCol.js').init(commands, storage, config)
  , repairController = require('./controller/RepairNode.js').init(commands, storage, config)
  , registerController = require('./controller/Register.js').init(commands, storage, config)
  , sysSupplierConfigController = require('./controller/SysSupplierConfig').init(commands, storage, config)
  //, syncinfoController = require('./controller/SyncInfo.js').init(commands, storage, config)
  , fake = require("./controller/FakeData").init(commands, storage, config)
  , JobPublisher = require('./modules/jobpublisher');//.init(commands, storage, config);	// need to setup rabbitmq
  ;

config.reload = function(_config) {
  console.log("reload config");
  var fs = require("fs");
  fs.readFile('./config/config.json', function (err, data) {
    var newConfig = JSON.parse(data.toString());
    for(var key in newConfig) {
      config[key] = newConfig[key];
    }
    console.log(config);
  });
};
var watcher = chokidar.watch('./config/config.json', {ignored: /[\/\\]\./, persistent: true});
watcher.on('change', function(path) {config.reload();});

log4js.configure('./config/log.config.json', { reloadSecs: 300 });
console.logger = log4js.getLogger('worker');

// prevent crash
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

// console.log(JSON.stringify(config));
var app = express();

app.configure(function(){ 
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Authorization");
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Methods', "GET");
        next();
    });
    app.set('port', process.env.PORT || config.communicationPort);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    //app.use(express.favicon(__dirname + '/public/images/favicon.png'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('A word for XXX'));
    app.use(express.session({secret: "A word for XXX"}));
    app.use(filter.userEnter);
    app.use(filter.escapeXss);
    app.use(filter.checkSupplierStatus);
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

app.get('/login', loginController.checkLogin);
app.post('/login', loginController.login);
app.del('/login', loginController.logout);
app.get('/user/config', loginController.getUserConfig);

// metadata
app.post('/meta/*', fileController.metaPost);
app.get('/meta/*', fileController.metaGet);
app.put('/meta/*', fileController.metaPut);
app.del('/meta/*', fileController.metaDelete);
app.get('/fileList', fileController.metaList);
// localfile


// register function
app.post('/registerNewAccount', registerController.registerNewAccount);
app.post('/registerNewMachine', registerController.registerNewMachine);
app.post('/registerConfig', registerController.registerConfig);
app.get('/checkAccount/:account', registerController.checkAccount);
app.get('/checkPassword/:account/:password', registerController.checkPassword);

//sysSupplierConfig Controller
app.get('/sysSupplierConfig/basic', sysSupplierConfigController.basicGet);
app.post('/sysSupplierConfig/basic', sysSupplierConfigController.basicPost);
app.get('/sysSupplierConfig/share', sysSupplierConfigController.shareGet);
app.post('/sysSupplierConfig/share', sysSupplierConfigController.sharePost);
app.get('/sysSupplierConfig/status/*', sysSupplierConfigController.statusGet);
app.get('/sysSupplierConfig/backup', sysSupplierConfigController.backUpGet);
app.post('/sysSupplierConfig/backup', sysSupplierConfigController.backUpPost);
app.post('/sysSupplierConfig/backupNow', sysSupplierConfigController.backupNow);
app.get('/sysSupplierConfig/listLocalDir', sysSupplierConfigController.listLocalDir);
app.get('/sysSupplierConfig/listLocalDir/*', sysSupplierConfigController.listLocalDir);

app.get('/sysSupplierConfig/keyGet', sysSupplierConfigController.keyGet);
app.post('/sysSupplierConfig/keyUpload', sysSupplierConfigController.keyUpload);

// upload function
// paramter key:
// upload_file_name
app.post('/file/*', uploadController.post);
app.post('/repairFile/*', uploadController.post);

// update function
// paramter key:
// upload_file_name
app.put('/file/*', uploadController.put);

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
// param:
// {"period_start":1380585600,"period_end":1380668400}
app.get('/hwinfo', hwinfoController.get);

// hw info collection
// var hwinfo = require("./controller/HWInfoCol").init(commands, storage, config);
// hwinfo.collectInfo();

// send Heartbeat 
var HeartBeat = require("./controller/HeartBeat").init(commands, storage, config);
HeartBeat.sendHeartBeat();

// syc fileList
var SycFileList = require("./controller/SyncFileList").init(commands, storage, config);
SycFileList.syncFile();

// repair data node
app.get('/repair/:clientID/*', repairController.get);

//config
app.get('/config', function(_req, _res) {
  var tmpCFG = {"register": !!config.register};
  _res.send(JSON.stringify(tmpCFG));
});

app.get('/command/*', require("./controller/CommandOperator").init(commands).get );
app.del('/command/*', require("./controller/CommandOperator").init(commands).delete );



server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
server80 = http.createServer(app).listen(80, function(){
  console.log("Express server listening on port 80");
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