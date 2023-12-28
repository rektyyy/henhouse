const input_room = document.getElementById('input_room');
const button_room = document.getElementById('button_room');

// Sends join room to server
button_room.addEventListener('click', () => {
    if (input_room.value) {
        currentRoomId = input_room.value;
        input_room.value = '';
        window.location.href = `/game.html?room=${currentRoomId}`;
    }
});
