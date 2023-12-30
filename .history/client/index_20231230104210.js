const input_room = document.getElementById('room');
const input_name = document.getElementById('name');
const button_room = document.getElementById('button_room');

// Joins room
button_room.addEventListener('click', () => {
    if (input_room.value) {
        currentRoomId = input_room.value;
        input_room.value = '';
        window.location.href = `/game.html?room=${currentRoomId}`;
    }
});
