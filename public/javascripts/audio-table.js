document.addEventListener('DOMContentLoaded', function () {

})

let selectedRow;
var isPlaying = 0;
var playpause = $("#playpause");


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
    setIsPlaying(1);
}

function setIsPlaying(_isPlaying){
    isPlaying = _isPlaying;
    $(playpause).removeClass("fa-play fa-pause");
    if(isPlaying){
        $(playpause).addClass("fa-pause");
    } else {
        $(playpause).addClass("fa-play");
    }
}

function togglePlayState(){
    if(isPlaying){
        currentTrack.pause();
    } else {
        currentTrack.play();
    }
    setIsPlaying(!isPlaying);
}

$(playpause).on("click",function(){ togglePlayState() });