
function generateMessage(text) {
    return {
        text: text,
        createdOn: new Date().getTime()
    }
}

function generateLocationMessage(url) {
    return {
        URL: url,
        createdOn: new Date().getTime()
    }
}
module.exports = {
    generateMessage,
    generateLocationMessage
}