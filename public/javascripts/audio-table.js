document.addEventListener('DOMContentLoaded', function () {

})

let selectedRow;

function playAudio(row) {
    console.log(row);
    if(selectedRow) {
        selectedRow.classList.remove('selected')
    }
    row.classList.add('selected')
    selectedRow = row

    current_track = document.getElementById("current_track");
    current_src = document.getElementById("current_src");
    console.log(current_src);
    current_src.setAttribute("src", "/song"); 
    current_track.load();
    current_track.play();
}
