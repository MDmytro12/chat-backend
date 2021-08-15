const {Schema , model} = require('mongoose')

const shema = Schema({
    isOnline : {type : Boolean , required : true} ,
    dialogId : {type : String , required : true},
    from : {type : String , required : true},
    to : {type : String , required : true},
    message : {
        content: {type: String },
        sended_at : {type: Date , default : Date.now }
    } ,
    author : {
        nameTo: {type : String  , required : true} ,
        nameFrom: {type : String  , required : true}
    }
})

module.exports = model("DialogItems" , shema)