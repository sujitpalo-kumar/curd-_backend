const Learner = require('../model/learnerModel')
const Course = require('../model/courseModel')
const bcrypt = require('bcryptjs')
const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken')

exports.signUp = async(req,res) =>{
    const emailExist = await Learner.findOne({learner_email:req.body.learner_email})

    if(emailExist){
        res.status(400).send("EmailAlready exists")
        return;
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.learner_password,salt)

    const user = new Learner({
        learner_name:req.body.learner_name,
        learner_email:req.body.learner_email,
        learner_password:hashedPassword
    })

    try {
        
        const registerSchema = Joi.object({
            learner_name: Joi.string().min(3).required(),
            learner_email: Joi.string().min(3).required().email(),
            learner_password: Joi.string().min(8).required()
        })

        const {error} = await registerSchema.validateAsync(req.body)
        
        if(error){
            res.status(400).send(error.details[0].message)
            return;
        }else{
            const saveUser = await user.save()
            res.status(200).send('user created successfully')
        }


    } catch (error) {
        res.status(500).send(error)
    }
}


exports.logIn = async (req,res) => {
    // VERIFY WHETHER EMAIL EXISTS OR NOT
    const user = await Learner.findOne({learner_email:req.body.learner_email})
    if(!user) return res.status(400).send("Incorrect Email ID")

    // CHECKING IF USER PASSWORD MATCHES OR NOT
    const validatePassword = await bcrypt.compare(req.body.learner_password, user.learner_password)
    if(!validatePassword) return res.status(400).send("Incorrect Password")

    try{
        const loginSchema = Joi.object({
            learner_email: Joi.string().min(3).required().email(),
            learner_password: Joi.string().min(8).required()
        })

        const {error} = await loginSchema.validateAsync(req.body)

        if(error) return res.status(400).send(error.details[0].message)
        else{
            const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
            res.header("auth-token", token).send(token)
            res.send("Logged in successfully")
        }
    }catch(error){
        res.status(500).send(error)
    }
}


exports.getAllUsers = async (req,res) => {
    const allUsers = await Learner.find()
    try{
        res.status(200).send(allUsers)
    }catch(error){
        res.status(500).send(error)
    }
}

exports.addCourse = async (req,res) =>{
    const courseExist = await Course.findOne({course_Id:req.body.course_Id})

    if(courseExist){
        res.send("course already exists")
    }

     

    try {

        const postCourse =  new Course({
            course_Id: req.body.course_Id,
            course_name: req.body.course_name,
            course_description: req.body.course_description
        })
        const saveCourse = await postCourse.save()
        res.status(200).send('course saved')
    } catch (error) {
        res.send(error)
    }
}


exports.getCourse = async (req,res) =>{
    const allCourse = await Course.find()
    try {
        res.send(allCourse)
    } catch (error) {
        res.send(error)
    }
}

