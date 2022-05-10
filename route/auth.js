const router = require('express').Router()
const verify = require('./authVerify')
const Collection = require('../controller/controller')

router.post('/register', Collection.signUp )

router.post('/login', Collection.logIn)

router.get('/getAllUsers', verify, Collection.getAllUsers)


// course


router.post('/addCourse',verify, Collection.addCourse)

router.get('/getCourse', verify, Collection.getCourse)


module.exports = router