var Test = require('../controllers/test')
var User = require('../controllers/user')
var Comment = require('../controllers/comment')
var Question = require('../controllers/question')
var Category = require('../controllers/category')

module.exports = function (app) {
    app.use(function (req, res, next) {
        var _user = req.session.user
        app.locals.user = _user;
        console.log('first middleware');
        next()
    });

    app.get('/', function (req, res) {
        console.log('request is ' + req.body);
        res.send('hello')
    });
    //登陆
    app.post('/user/login',User.login);
    //注册
    app.post('/user/sign',User.sign);
    // app.get/admin/user
    app.get('/admin/user');
    /*
    *专项练习,生成10道题目,和需要的时间
    *
     */
    app.get('/category',Question.category);
    app.get('/subName/:category',Question.subName);
    /*
    *question
     */
    app.get('/question/:offset/:num/:category',Question.question);


}

