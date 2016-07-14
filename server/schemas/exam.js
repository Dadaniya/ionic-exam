/**
 * Created by nizhiwang on 16/5/26.
 */
/**
 * Created by nizhiwang on 16/5/20.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var ExamSchema = new mongoose.Schema({
    
    user:{type:ObjectId,ref:'User'},
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



ExamSchema.statics = {
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

module.exports = ExamSchema