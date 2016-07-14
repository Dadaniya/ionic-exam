var mongoose = require('mongoose')
var TestSchema = require('../schemas/test')

module.exports=mongoose.model("Test",TestSchema);