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
    let songId = row.getAttribute("id");
    let currentTrack = document.querySelector("#current_track");
    let currentSrc = document.querySelector("#current_src");

    currentSrc.setAttribute("src", "/song/"+ songId);
    currentTrack.load();
    currentTrack.play();
}
