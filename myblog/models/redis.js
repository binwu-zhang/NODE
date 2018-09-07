const redis = require("redis")
const redisClient = redis.createClient();

module.exports = {
    login: function login(user_id){
        console.log('login success')
        redisClient.hset("online_users", user_id, '1');
    },
    logout: function logout(user_id){
        redisClient.hdel("online_users", user_id);
    },
    getOnlineUsers: function getOnlineUsers(){
        var result = 'sss'
        return redisClient.hgetall('online_users', function(err, obj){
            result = obj

        })
        return 'ssss'
        return result
    }
}