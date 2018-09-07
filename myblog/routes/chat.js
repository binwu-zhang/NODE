const express = require('express')
const router = express.Router()


const checkLogin = require('../middlewares/check').checkLogin


router.get('/', checkLogin, function (req, res, next) {
    //聊天室
    res.render('chat/index',{
        'user_id': req.session.user._id
    })
})

module.exports = router