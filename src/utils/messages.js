const generateMessage = (text, username) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (url,username) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}


module.exports = {
    generateMessage,
    generateLocationMessage
}