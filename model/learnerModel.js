const mongoose = require('mongoose')

const learnerSchema = new mongoose.Schema({
    learner_name:{
        type:String,
        required:true,
        min: 6,
        max: 255
    },
    learner_email:{
        type:String,
        required:true,
        min: 6,
        max: 255
    },
    learner_password:{
        type: String,
        required:true,
        min: 8,
        max: 255
    }
})

module.exports = mongoose.model('student',learnerSchema)