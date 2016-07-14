/**
 * Created by nizhiwang on 16/5/22.
 */
var mongoose = require('mongoose')
var Question = mongoose.model('Question');
var Exam =mongoose.model('Exam');
var Test =mongoose.model('Test');
var User=mongoose.model('User');
var Category=mongoose.model('Category');

// detail pagedd
exports.detail = function (req, res) {

    console.log("start detail");
    var one = new Question({
        question: "please select the right answer to get home44",
        answer: ["selectA", "selectB", "selectC", "selectD"],
        type: "radio",
        rightA: "A",
        summary: "cant understand to select A",
        pv: 1,

    });
    res.send({status:"susccess"})
    // one.save(function (err, data) {
    //     if(err)console.log("save error"+err);
    //     console.log("sucdcess save " + data);
    //     Question.findOne({}, function (err, question) {
    //         if(err)console.log("find error"+err);
    //         console.log(typeof question);
    //         res.send(question);
    //
    //
    //     })
    //
    // })


};

exports.category=function (req, res) {
    Category.distinct('name',{},function(err,data){
        res.send({code:'ok',data:data});
    })
}

exports.subName=function(req,res){
    var category=req.params.category;

    var count={};
    var cdata=[]
    Category.find({name:category},function (err, data) {
        var promises=[];
        var order=[];
        data.forEach(function(value,index){
            promises[index]=Question.count({category:value._id}).exec();
            order.push([value.subName,value._id]);
        })
        Promise.all(promises).then(function(datas){
            datas.forEach(function(value,index){
                cdata.push({name:order[index][0],_id:order[index][1],all:value})


            })
                res.send({code:'ok',data:cdata});
        })
    });

    // Category.find({name:category}).select('name subName').exec(function(err,data){
    //     data.forEach(function(value,index){
    //         count[value._id]=Question.count({category:value._id});
    //     })
    // })
    // Question.count({category:category})
    //
    // var promises=[];
    // Category.count({},function(err,n){console.log(n)});
    // Category.find().select('name subName').exec(function(err,data){console.log(data);})
    // Category.find({},'name',function(err,data){
    //     console.log(data);
    // })
    // Category.fetch(function(err,categories){
    //     // console.log(categories);
    //     categories.forEach(function(category,index,arr){
    //         // console.log(category);
    //
    //         promises[index]=Question.find({category:category._id}).exec();
    //        // Question.find({}).exec(function(err,data){
    //        //     console.log(data);
    //        // });
    //     });
    //     // promises[0].then(function(err,data){console.log('has data'+data);})
    //     Promise.all(promises).then(function(datas){   //     promise.then(function(data){})
    //         datas.forEach(function(data,index){
    //             data[0]&&console.log(data[0].summary);
    //         });
    //
    //         });
    //
    // });
    // res.send(null);
}
exports.question=function(req,res){
    var num=parseInt(req.params.num);
    var offset=parseInt(req.params.offset);
    var category=req.params.category;

    Question.find({category:category}).sort({'meta.createAt':1}).select('question answer rightA summary category type').skip(offset).limit(num).exec(function(err,data){
        res.send({
            code:'ok',
            data:data
        })
    })
    
}