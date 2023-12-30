const socket = io();

const input_room = document.getElementById('room');
const input_name = document.getElementById('name');
const button_room = document.getElementById('button_room');
const button_get_rooms = document.getElementById('button_get_rooms')
button_room.addEventListener('click', () => {
    console.log('Button clicked');
    const roomId = input_room.value
    const playerName = input_name.value;

    if (roomId && playerName) {
        // socket.emit('join room', roomId, playerName);
        window.location.href = `/game.html?room=${encodeURIComponent(roomId)}&name=${encodeURIComponent(playerName)}`;
;

    } else {
        alert("Please enter both a room and a name.");
    }
});



