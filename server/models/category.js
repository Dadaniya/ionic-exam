/**
 * Created by nizhiwang on 16/5/20.
 */
var mongoose = require('mongoose')
var CategorySchema = require('../schemas/category')

module.exports=mongoose.model("Category",CategorySchema);