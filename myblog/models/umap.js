const UMap = require('../lib/mongo').UMap

module.exports = {
    // 记录在线
    create: function create (umap) {
        return UMap.create(umap).exec()
    },
    isOnLine: function isOnLine(userID){
        return UMap.findOne({ author: userID }).exec()
    },
    offLine: function offLine (userID) {
        return UMap.deleteMany({ author: userID })
            .exec()
    },
    getAllOnLine: function getAllOnLine(){
        return UMap.find()
            .exec()
    }
}