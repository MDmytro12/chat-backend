const {Schema , model} = require('mongoose')

const schema = Schema({
    dialogId : { type : "String" , required: true} ,
    messages : [
        { 
            content : String ,
            isReadedFrom : Boolean ,
            isReadedTo : Boolean ,
            sended_At : { type : Date , default : Date.now } ,
        }
    ]
})

module.exports = model('dialogs' , schema)