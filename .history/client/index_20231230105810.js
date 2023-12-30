const socket = io(); // Make sure to serve 'socket.io' client script from your server

// Access DOM elements
const input_room = document.getElementById('room');
const input_name = document.getElementById('name');
const button_room = document.getElementById('button_room');

// Add event listener for the 'Join room' button
button_room.addEventListener('click', () => {
    const roomId = input_room.value
    const playerName = input_name.value;

    if (roomId && playerName) {
        // Emit the 'join room' event with roomId and playerName
        socket.emit('join room', roomId, playerName);
        // Navigate to the game page or handle the room joining logic here
    } else {
        alert("Please enter both a room and a name.");
    }
});
