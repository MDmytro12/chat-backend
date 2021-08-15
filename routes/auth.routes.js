const {Router}  =require('express');
const User = require('../models/User')
const DialogItems = require('../models/DialogItem')
const bcrypt = require('bcrypt')
const {check , validationResult} = require('express-validator')
const router = Router()
const config = require('config')
const bodyParser = require('body-parser');
const {nanoid} = require('nanoid');
const Dialog = require('../models/Dialog');

router.post('/register' ,[
    bodyParser.json(),
    bodyParser.urlencoded({extended: true}),
    check('email' , 'Emial apllymiddleware uncorrect!').normalizeEmail().isEmail(),
    check('password' , 'Paasword applymiddleware uncorrect').isLength(6)
],
    async (req , res) => {
        try{

            const errors = validationResult(req)

            const {email , password} = req.body

            if(!errors.isEmpty()){
                return res.status(400).json({message : errors.array()})
            }

            const user = await User.findOne({email})

            if(user){
                return res.status(400).json({ message: "User already exists!" })
            }
            
            const hashedPassword = await bcrypt.hash(password , 12)

            const userModel = new User({email , password : hashedPassword})
            

            const allUsers = await User.find()

            await allUsers.map( item => {
              let  dialogItem = new DialogItems({
                isOnline : false ,
                dialogId : nanoid(),
                from : email , 
                to : item.email,
                message : {
                  content : "Get started dialog!" ,
                  sended_at: Date.now()
                },
                author :{
                  nameTo : item.email , 
                  nameFrom : email 
                }
              })

              dialogItem.save()
            })

            await allUsers.map( item => {
              const dialog = new Dialog({
                  dialogId : nanoid(),
                  messages : [] ,
                  isReadedTo : false ,
                  isReadedFrom : false ,
                  sended_at : Date.now()
              })

              dialog.save()
            } )

            await userModel.save()
            
            return res.status(200).json({message : "User is created!"})


        }catch (e) {
            res.status(500).json({ "message" : "Registerm is doesn`t work!"})
        }
})

router.post('/login' , 
    [   
        bodyParser.json(),
        bodyParser.urlencoded({extended : true}),
        check('email' , "Enter correct password in order to log in system!").normalizeEmail().isEmail(),
        check('password' , 'Enter password!' ).exists() 
    ],
    async (req, res) => {
        try {
          const errors = validationResult(req)      
      
          if (!errors.isEmpty()) {
            return res.status(400).json({
              errors: errors.array(),
              message: 'Uncorrect data to log in the system!'
            })
          }
      
          const {email, password} = req.body
      
          const user = await User.findOne({ email })
      
          if (!user) {
            return res.status(400).json({ message: 'User is no found!' })
          }
      
          const isMatch = await bcrypt.compare(password, user.password)
      
          if (!isMatch) {
            return res.status(400).json({ message: 'Uncorrect password , try again!' })
          }
    
          return res.status(200).json({message : "success"})
      
        } catch (e) {
          res.status(500).json({ message: 'Something is wrong , try again!  ' })
        }
      }
    )

module.exports = router