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

    current_track = row.querySelector("#current_track");
    current_src = row.querySelector("#current_src");
    rowId = row.getAttribute("id");
    current_src.setAttribute("src", "/song"+ rowId); 
    current_track.load();
    current_track.play();
}
