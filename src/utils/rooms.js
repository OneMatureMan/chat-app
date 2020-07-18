const sendRooms = (rooms) => {
    let allRooms = []
    rooms.map(room => {
        allRooms.push({
            name:room
        })
    })
    return allRooms
}

module.exports = sendRooms