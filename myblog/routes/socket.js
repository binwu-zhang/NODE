module.exports = function(server){
    const ChatModel = require('../models/chat')
    const io = require('socket.io')(server)
    io.use(function(socket, next){
        const UserModel = require('../models/users')
        UserModel.getUserById(socket.handshake.query.ucode)
            .then(function (posts) {
                delete posts.password
                socket.userInfo = posts
                next();
            })
    });
    io.on('connection', function(client){
        io.emit('tip', {"message":client.userInfo.name+'进入'})
        const UMap = require('../models/umap')
        UMap.getAllOnLine()
            .then(function(offLine){
                io.emit('update online list', {"onlineUsers":offLine})
            })

        //client.broadcast.emit('new connect', '新用户上线了')  //广播 除了自己

        // 监听发送消息
        client.on('send message', function(msg){
            //聊天信息入库
            const chatContent = {
                author: client.userInfo._id,
                content: msg.content
            }
            ChatModel.create(chatContent)
            client.broadcast.emit('send message', {"user_name":client.userInfo.name,"message":msg.content})
        });
        // 断开连接时，通知其它用户
        client.on('disconnect', function(){
            client.broadcast.emit('tip', {"message":client.userInfo.name+'退出'})
            const UMap = require('../models/umap')
            UMap.getAllOnLine()
                .then(function(offLine){
                    io.emit('update online list', {"onlineUsers":offLine})
                })
        })
    })
}
