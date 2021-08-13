const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);
const config = require('config')
const mongoose = require('mongoose')

const PORT = config.get('port') || 5001

app.use('/auth' , require('./routes/auth.routes'))

async function start(){
    try{
        await mongoose.connect(config.get("mongoURI" , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }));

        app.listen(PORT , () => {
            console.log(`Started on port ${PORT}`)
        })
    }catch (e){
        console.log('Server error : ' , e.message)
        process.exit()
    }
}

start()

