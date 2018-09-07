const marked = require('marked')
const Chat = require('../lib/mongo').Chat

// 将 comment 的 content 从 markdown 转换成 html
Chat.plugin('contentToHtml', {
    afterFind: function (chatContent) {
        return chatContent.map(function (chatContent) {
            chatContent.content = marked(chatContent.content)
            return chatContent
        })
    }
})

module.exports = {
    // 记录一条聊天
    create: function create (chatContent) {
        return Chat.create(chatContent).exec()
    },
}