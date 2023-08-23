const socket = io()

let user
let chatBox = document.getElementById('chatbox')
let messageLogs = document.getElementById('messageLogs')

const identificate = async () => {
    try {
        const result = await Swal.fire({
            title: 'Identificate',
            input: 'text',
            text: 'Ingresa el nombre de usuario para poder chatear',
            inputValidator: (value) => {
                return !value && '¡No puedes chatear sin identificarte!';
            },
            allowOutsideClick: false,
        });

        user = result.value;
        socket.emit('joinChat', user)
        socket.emit('messages',)
    } catch (error) {
        console.error('Error en la identificación:', error);
    }
}

identificate();

socket.on('notification', notif => {
    notificationContainer.innerHTML = notif
    setTimeout(() => {
        notificationContainer.innerHTML = ''
    }, 3000)
})

chatBox.addEventListener('keyup', e => {
    if (e.key === 'Enter' && chatBox.value.trim(0).length > 0 && user) {
        socket.emit('newMessage', { user: user, message: chatBox.value })
        chatBox.value = '';
    }
})

socket.on('printPreviousMessages', (messages) => {
    messageLogs.innerHTML = '';
    messages.forEach(message => {
        messageLogs.innerHTML += `
      <div><span class="message">${message.user} (${message.formattedTimestamp}):</span> ${message.content}</div>`
    });
});

socket.on('printNewMessage', ({ user, content, timestamp }) => {
    messageLogs.innerHTML += `
    <div><span class="message">${user} (${timestamp}):</span> ${content}</div>`
});