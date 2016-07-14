/**
 * Created by nizhiwang on 16/5/22.
 */
var mongoose = require('mongoose')
var User = mongoose.model('User')


// midware for user
exports.signinRequired = function (req, res, next) {
    var user = req.session.user

    if (!user) {
        return res.redirect('/signin')
    }

    next()
}

exports.adminRequired = function (req, res, next) {
    var user = req.session.user

    if (user.role <= 10) {
        return res.redirect('/signin')
    }

    next()
}

exports.sign = function (req, res) {

    User.findOne({name:req.body.name},function(err,user){
        if(err){res.send({code:'err',err:err})}
        else if(user){res.send({code:'err',reason:'user exist'})}
        else {
            var newOne=new User({"name":req.body.name,"password":req.body.password});
            newOne.save(function(err,data){
                console.log("data"+data);
                console.log("err"+err);
                if(err){res.send({code:"err",reason:err})}
                else{res.send({
                    code:"ok",

                })}
            })
        }
        })



}

exports.login=function(req,res){
    var user=new User({"name":req.body.name,"password":req.body.password});
    User.findOne({name:req.body.name})
        .exec(function(err,data){
            console.log(err);
            if(err){res.send({code:'err',reason:err})}
            if(!data){res.send({code:'err',reason:'not exist'})}
            else{

            data.comparePassword(req.body.password,function(err,isMatch){
                if(err){res.send({code:'err',reason:err})}
                else if(isMatch){res.send({code:'ok'})}
                else {res.send({code:'err',resason:'password wrong'})}
            })
            }
        })
}

