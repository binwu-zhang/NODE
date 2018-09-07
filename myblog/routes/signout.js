const express = require('express')
const router = express.Router()
//const redisModel = require('../models/redis')
const UMapModel = require('../models/umap')

const checkLogin = require('../middlewares/check').checkLogin

// GET /signout 登出
router.get('/', checkLogin, function (req, res, next) {

    //redisModel.logout(req.session.user._id)
    // 清空 session 中用户信息
    UMapModel.offLine(req.session.user._id)
        .then(function(obj){
            req.session.user = null
            req.flash('success', '登出成功')
            // 登出成功后跳转到主页
            res.redirect('/posts')
        })
})

module.exports = router