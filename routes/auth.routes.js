const {Router}  =require('express');
const User = require('../models/User')
const bcrypt = require('bcrypt')
const {check , validationResult} = require('express-validator')
const router = Router()
const jwt = require('jsonwebtoken')
const config = require('config')

router.post('/register' ,
    [
        check('email' , 'Email is uncorrect!').isEmail(),
        check('password' , "Password is too short!").isLength({
            min: 6
        })
    ],
    async (req , res) => {
        try{

            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Unncorrect data from client!'
                })
            }

            const {email , password} = req.body

            const existUser = await User.findOne({ emial })

            if(existUser){
                return res.status(400).json({message: "This user alread exists!"})
            }

            const hashedPassword = await bcrypt.hash(password , 12)
            const user = new User({ email , password: hashedPassword })

            res.status(201).json({message: "User is created!"})

        }catch(e){
            res.status(500).json({ message : "Error with register!" })
        }
})

router.post('/login' ,
    [
        check('email' , "Enter correct password in order to log in system!").isEmail(),
        check('password' , 'Enter password!' ).exists()
    ],
    async (req , res) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: "Unccorect data to order log in system!"
            })
        }

        const {email , password} = req.body;

        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({
                message: "This user is doesnt exists!"
            })
        }

        const match = bcrypt.compare(password , user.password)

        if(!match){
            return res.status(400).json({
                message: "Unncorrect password!"
            })
        }

        const token = jwt({userId: user.Id} , config.get('jwtSecret') , {expiresIn: '1h'})

        res.json({token , userId})
})

module.exports = router