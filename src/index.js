const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))



io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', (options,callback) => {
        const {error, user} = addUser({ id:socket.id , ...options })

        if(error){
            return callback(error)
        }


        socket.join(user.room)
        socket.emit('message', generateMessage('Welcome!','Admin'))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`,'Admin'))
        const users = getUsersInRoom(user.room)
        io.to(user.room).emit('roomData', { room:user.room, users })
        callback()
    })

    socket.on('sendMessage', (message,callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(message,user.username))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {  
            const users = getUsersInRoom(user.room)
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`,'Admin'))
            io.to(user.room).emit('roomData', { room:user.room, users})
          
        }

    })

    // recieving location
    socket.on('sendLocation', (coords,callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(`https://www.google.com/maps/?q=${coords.lat},${coords.lon}`,user.username))
        callback()
    })
})

server.listen(port, () => {
    console.log('listening on port ',port)
})