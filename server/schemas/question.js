/**
 * Created by nizhiwang on 16/5/20.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var QuestionSchema = new Schema({
    question: String,
    answer: Array,
    type:{
        type:String,
        default:'radio',//0为单选,1为多选 ,判断得分 serach()得.5,成功前题长度相同+.5;或者  radio  ,checkbox
    },
    rightA: String,
    summary: String,
        pv: {
        type: Number,
        default: 0
    },
    category: {
        type: ObjectId,
        ref: 'Category'
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

// var ObjectId = mongoose.Schema.Types.ObjectId
QuestionSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }

    next()
})

QuestionSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function(id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
}

module.exports = QuestionSchema