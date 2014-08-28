"use strict";

//dependencies
var config = require('./config'),
    express = require('express'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    helmet = require('helmet'),
    webSocketServer = require('./webSocketServer'),
    cluster = require('cluster'),
    captcha = require('easy-captcha'),
    i18n = require('i18n-2');

//create express app
var app = express();

//keep reference to config
app.config = config;

i18n.expressBind(app, {
    // setup some locales - other locales default to en silently
    locales: ['en', 'fr'],
    // change the cookie name from 'lang' to 'locale'
    cookieName: 'locale'
});

//setup the web server
app.server = http.createServer(app);

//setup mongoose
app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
    //and... we have a data store
});

//config data models
require('./models')(app, mongoose);

//settings
app.disable('x-powered-by');
app.set('port', config.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//middleware
app.use(require('morgan')('dev'));
app.use(require('compression')());
app.use(require('serve-static')(path.join(__dirname, 'public')));
app.use(require('body-parser')());
app.use(require('method-override')());
app.use(require('cookie-parser')());
app.use(session({
    secret: config.cryptoKey,
    store: new mongoStore({ url: config.mongodb.uri })
}));
app.use(passport.initialize());
app.use(passport.session());
helmet.defaults(app);

//captcha
app.use('/captcha.jpg', captcha.generate());

//i18n
app.use(function(req, res, next) {
    req.i18n.setLocaleFromCookie();
    next();
});

//sign up + captcha
app.get('/signup/', require('./views/signup/index').init);
app.post('/signup/', captcha.check, require('./views/signup/index').signup);


//response locals
app.use(function (req, res, next) {
    res.locals.user = {};
    res.locals.user.defaultReturnUrl = req.user && req.user.defaultReturnUrl();
    res.locals.user.username = req.user && req.user.username;
    next();
});

//global locals
app.locals.projectName = app.config.projectName;
app.locals.copyrightYear = '2012-2014';
app.locals.copyrightName = app.config.companyName;
app.locals.cacheBreaker = 'br34k-01';

//setup passport
require('./passport')(app, passport);

//setup routes
require('./routes')(app, passport);

//custom (friendly) error handler
app.use(require('./views/http/index').http500);

//setup utilities
app.utility = {};
app.utility.sendmail = require('./util/sendmail');
app.utility.slugify = require('./util/slugify');
app.utility.workflow = require('./util/workflow');

var wsServer = new webSocketServer.Server(app);

wsServer.server.on('request', function (request) {
    wsServer.processRequest(request);
});

//listen up
/*if (cluster.isMaster) {
    var cpuCount = require('os').cpus().length;

    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
} else { */
    app.server.listen(app.config.port, function () {
    });
//}

