const sha1 = require('sha1')
const express= require('express')
const router = express.Router()

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin
//const redisModel = require('../models/redis')
//const redis = require("redis")
//const redisClient = redis.createClient();
const UMapModel = require('../models/umap')

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
    res.render('signin')
})

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
    const name = req.fields.name
    const password = req.fields.password

    // 校验参数
    try {
        if (!name.length) {
            throw new Error('请填写用户名')
        }
        if (!password.length) {
            throw new Error('请填写密码')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }

    UserModel.getUserByName(name)
        .then(function (user) {
            if (!user) {
                req.flash('error', '用户不存在')
                return res.redirect('back')
            }
            // 检查密码是否匹配
            if (sha1(password) !== user.password) {
                req.flash('error', '用户名或密码错误')
                return res.redirect('back')
            }
            UMapModel.isOnLine(user._id)
                .then(function(isonline){
                    if(isonline !== null){
                        req.flash('success', '该账号已在其他地方登录')
                        return res.redirect('back')
                    }
                    const umap = {
                        author: user._id,
                        name: user.name
                    }
                    UMapModel.create(umap)
                        .then(function(){
                            req.flash('success', '登录成功')
                            // 用户信息写入 session
                            delete user.password
                            req.session.user = user
                            // 跳转到主页
                            res.redirect('/posts')
                        })
                        .catch(next)
                })
            //redisModel.login(user._id)


        })

})

module.exports = router