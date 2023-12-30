const socket = io();
const button_get_rooms = document.getElementById('button_get_rooms')
button_get_rooms.addEventListener('click',()=>{
    socket.emit('request rooms');
    window.location.href = '/rooms.html';
})
