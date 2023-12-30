const socket = io();

socket.on('connect', () => {
    socket.emit('request rooms'); // Request rooms on connecting
});

socket.on('active rooms', function (roomIds) {
    const roomsList = document.getElementById('roomsList');
    roomsList.innerHTML = ''; // Clear existing list

    roomIds.forEach(function (roomId) {
        const listItem = document.createElement('li');
        listItem.textContent = roomId;
        roomsList.appendChild(listItem);
    });
});
