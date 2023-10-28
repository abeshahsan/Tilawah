document.addEventListener('DOMContentLoaded', function () {

})

let selectedRow;

function playAudio(row) {
    if(selectedRow) {
        selectedRow.classList.remove('selected')
    }
    row.classList.add('selected')
    selectedRow = row
}
