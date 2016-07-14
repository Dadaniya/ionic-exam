var mongoose = require('mongoose')
var ExamSchema = require('../schemas/exam')

module.exports=mongoose.model("Exam",ExamSchema);