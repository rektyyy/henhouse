const socket = io(); // Make sure to serve 'socket.io' client script from your server

// Access DOM elements
const input_room = document.getElementById('room');
const input_name = document.getElementById('name');
const button_room = document.getElementById('button_room');

// Add event listener for the 'Join room' button
button_room.addEventListener('click', () => {
    console.log('Button clicked');
    const roomId = input_room.value
    const playerName = input_name.value;

    if (roomId && playerName) {
        // socket.emit('join room', roomId, playerName);
        window.location.href = `/game.html?room=${encodeURIComponent(roomId)}&name=${encodeURIComponent(playerName)}`;

    } else {
        alert("Please enter both a room and a name.");
    }
});
