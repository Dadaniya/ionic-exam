/**
 * Created by nizhiwang on 16/5/18.
 */
/*
*   {code:'ok/error',reason:'',other:'',data:{}}
 */
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require('express-session');
var multiparty = require('connect-multiparty')    //上传图片用的,作为中间用的 multipart/form-data 多种数据
var mongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var serve_static = require('serve-static');
var app = express();
var fs = require('fs');
var port = process.env.port || 3000;
var dbUrl='mongodb://guest:guest123@localhost/exam'
mongoose.connect(dbUrl)
var models_path = __dirname + '/models';
var walk = function(path){
    fs.readdirSync(path)
        .forEach(function(file){
            var newPath = path + '/' +file;
            var stat = fs.statSync(newPath)
            if(stat.isFile()){
                if(/(.*)\.(js|coffee|jsx)/.test(file)){
                    require(newPath);
                }
            }
              else if(stat.isDirectory){
                walk(newPath);
            }
    })
};
walk(models_path);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())

// app.use(express.multiparty());
app.use(session({
    secret:'$exam$',   //cookie.parser(secret,)
    resave:false,
    saveUninitialized: true,//不加出错
    store:new mongoStore({
        url:dbUrl,
        collection:'sessions',
    })
}));;
// app.locals.moment=require('moment')
app.use(serve_static(path.join(__dirname,'public')));

var env=process.env.NODE_ENV || 'development';
if('development'=== env){
    app.set('showStackError',true);
    app.use(logger(':method :url :status'))
    app.locals.pretty=true
}
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


require('./config/routes')(app)
app.listen(port);

console.log('start');