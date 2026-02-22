document.addEventListener("DOMContentLoaded", () => {

    const socket = io();
    const form = document.getElementById('send-container');
    const messageInput = document.getElementById('messageInp');
    const messageContainer = document.querySelector('.container');

    const audio = new Audio('/ting.mp3');  // ⭐ fixed

    let name = prompt("Enter your name to join");
    if (!name || name.trim() === "") name = "Anonymous";

    socket.emit('user-joined', name);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageInput.value.trim();
        if(message === "") return;

        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    });

    socket.on('receive', data => {
        append(`${data.name}: ${data.message}`, 'left');
        audio.play().catch(()=>{});
    });

    socket.on('user-joined', name => {
        append(`${name} joined the chat`, 'left');
        audio.play().catch(()=>{});
    });

    socket.on('left', name => {
        append(`${name} left the chat`, 'left');
        audio.play().catch(()=>{});
    });

    function append(message, position) {
        const messageElement = document.createElement('div');
        messageElement.innerText = message;
        messageElement.classList.add('message', position);
        messageContainer.append(messageElement);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

});