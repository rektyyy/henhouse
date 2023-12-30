const socket = io();

const input_room = document.getElementById('room');
const input_name = document.getElementById('name');
const button_room = document.getElementById('button_room');

button_room.addEventListener('click', () => {
    console.log('Button clicked');
    const roomId = input_room.value
    const playerName = input_name.value;

    if (roomId && playerName) {
        // socket.emit('join room', roomId, playerName);
        const encodedRoomId = encodeURIComponent(roomId);
        const encodedPlayerName = encodeURIComponent(playerName);
        console.log(encodedPlayerName);
        window.location.href = `/game.html?room=${encodedRoomId}&name=${encodedPlayerName}`;


    } else {
        alert("Please enter both a room and a name.");
    }
});
