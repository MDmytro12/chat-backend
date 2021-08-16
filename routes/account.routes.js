const {Router} = require('express')
const DialogItems = require('../models/DialogItem')
const Dialogs = require('../models/Dialog')
const router = Router()
const bodyParser = require('body-parser')
const config = require('../config/default.json')

router.post('/dis' ,
    [
        bodyParser.json(),
    ],
    async (req , res) => {
        try{
            const dialogItems = await DialogItems.find()

            return res.status(200).json(dialogItems)
        }catch (e){
            return res.status(500).send('Error on server!')
        }
    }
)

router.post( '/mbdi' , [
        bodyParser.json() ,
        bodyParser.urlencoded({ extended: true })
    ] , 
    async (req , res) => {
        try{
            const {id} = req.body

            const dialog = await Dialogs.findOne({dialogId : id})

            return res.status(200).json(dialog)
            
        }catch (e){ 
            return res.status(500).json({message : "Error with server to get dis by id!"})
        }
})

router.post('/gdbi' , [

])
        
module.exports = router 