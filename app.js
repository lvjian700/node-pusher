
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, http = require('http')
, path = require('path')
, http_io = require('./core/http.io.js')
, pusher = require('./core/pusher')
, logger = require('./core/logger').logger;

logger.info('initialize express http server ...');
var app = express();

logger.info('configure express...');
app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	var faviconPath = path.join(__dirname, 'public', 'favicon.ico');
	app.use(express.favicon(faviconPath));
	
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.get('/', routes.index);

logger.info("start http & socket.io server...");
logger.info('create http server on express...');
var server = http.createServer(app);
logger.info('socket.io listening http server...');

var io = http_io.listen(server);
logger.info("start socket.io server success!");

logger.info('start listening http ...');
server.listen(app.get('port'), function(){
	logger.info('start http server success!');
	logger.info("Express server listening on port " + app.get('port'));
}); 

logger.info("listening socket.io event...");
pusher.start(io);
