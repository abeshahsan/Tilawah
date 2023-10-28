document.addEventListener('DOMContentLoaded', function () {

})

let selectedRow;

function playAudio(row) {
    if(selectedRow) {
        selectedRow.classList.remove('selected')
    }
    row.classList.add('selected')
    selectedRow = row

    currentTrack = document.querySelector("#current_track");
    currentSrc = document.querySelector("#current_src");
    let rowId = row.getAttribute("id");
    currentSrc.setAttribute("src", "/song/"+ rowId); 
    currentTrack.load();
    currentTrack.play();
}
