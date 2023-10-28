document.addEventListener('DOMContentLoaded', function () {

})

let selectedRow;

function playAudio(row) {
    if(selectedRow) {
        selectedRow.classList.remove('selected')
    }
    row.classList.add('selected')
    selectedRow = row

    current_track = document.querySelector("#current_track");
    current_src = document.querySelector("#current_src");
    let rowId = row.getAttribute("id");
    current_src.setAttribute("src", "/song/"+ rowId); 
    current_track.load();
    current_track.play();
}
