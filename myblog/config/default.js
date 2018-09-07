module.exports = {
    port: 8080,
    session: {
        secret: 'myblog',
        key: 'myblog',
        maxAge: 2592000000
    },
    mongodb: 'mongodb://localhost:27017/myblog',
    chat_port: 3001
}