const socket = io();
const button_get_rooms = document.getElementById('button_get_rooms')


socket.on('active rooms', function (roomIds) {
    const roomsList = document.getElementById('roomsList');
    roomsList.innerHTML = ''; // Clear existing list

    roomIds.forEach(function (roomId) {
        const listItem = document.createElement('li');
        listItem.textContent = roomId;
        roomsList.appendChild(listItem);
    });
});

button_get_rooms.addEventListener('click',()=>{
    socket.emit('request rooms');

    window.location.href = '/rooms.html';
})
