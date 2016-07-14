/**
 * Created by nizhiwang on 16/5/20.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CategorySchema = new Schema({
    name: {type:String,require:true},
    subName: {type:String},
    // questions: [{type: ObjectId, ref: 'Question'}],
    // limte:{
    //     examTime:Number,   //单位分钟,考试时间
    //     examQuestion:Number//question数量,此项数据可以放在个人配置中
    // },
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
CategorySchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }

    next()
})

CategorySchema.statics = {
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

module.exports = CategorySchema
