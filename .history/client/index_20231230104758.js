const input_room = document.getElementById('room');
const input_name = document.getElementById('name');
const button_room = document.getElementById('button_room');

// Joins room

button_room.addEventListener('click', () => {
    const roomId = input_room.value;
    const playerName = input_name.value;

    if (roomId && playerName) {

        window.location.href = `/game.html?room=${roomId}&name=${encodeURIComponent(playerName)}`;
    } else {
        alert("Please enter both a room and a name.");
    }
});
