const socket = io()


// Elements
const $rooms = document.querySelector('#roomsList')

// Templates
const roomsTemplate = document.querySelector('#rooms-template').innerHTML




socket.emit('started')

socket.on('availableRooms', (rooms) => {
    // console.log(rooms[0].name)
    const html = Mustache.render(roomsTemplate, {
        rooms
    })
    $rooms.innerHTML = html
})

