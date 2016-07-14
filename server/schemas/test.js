/**
 * Created by nizhiwang on 16/5/20.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var TestSchema = new mongoose.Schema({
    exam:{type:ObjectId,ref:'Exam'},
    question: [{type: ObjectId, ref: 'Question'}],
   
   
    myAnswer: [{type:String}],
    score:{
        type:Number,
        default:0,
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        // updateAt: {
        //     type: Date,
        //     default: Date.now()
        // }
    }
})


TestSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.createAt')
            .exec(cb)
    },
    findById: function(id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
}

module.exports = TestSchema