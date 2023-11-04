$(document).ready(function () {
    let selectedRow;
    let isPlaying = 0;
    let playPause = $("#play-pause");
    let currentTrack = document.querySelector("#current-track");
    let currentSrc = document.querySelector("#current-src");

    let playingSongId = localStorage.getItem("song-id");
    $(".audio-row").each(function (i, element) {
        if(playingSongId == $(element).attr("id")){
            if(localStorage.getItem("page-reloaded") == 1){
                localStorage.setItem("page-reloaded",0);
                currentSrc.setAttribute("src", "/song/" + playingSongId);
                currentTrack.load();
            }
            $(element).addClass("selected");
            selectedRow = element;
        }
        $(element).on("click", function () {
            playAudio($(element))
        })
    })

    window.onbeforeunload = function reloadHandler(){
        localStorage.setItem("page-reloaded",1);
    }
    function playAudio(row) {
        if (selectedRow) {
            $(selectedRow).removeClass('selected');
        }
        $(row).addClass('selected');
        selectedRow = row
        let songId = $(row).attr("id");

        currentSrc.setAttribute("src", "/song/" + songId);
        currentTrack.load();
        currentTrack.play();
        currentTrack.volume = .5;
        setIsPlaying(1);
        localStorage.setItem("song-id",songId);
    }
    
    function setIsPlaying(_isPlaying) {
        isPlaying = _isPlaying;
        $(playPause).removeClass("fa-play fa-pause");
        if (isPlaying) {
            $(playPause).addClass("fa-pause");
        } else {
            $(playPause).addClass("fa-play");
        }
    }

    function togglePlayPause() {
        if (isPlaying) {
            currentTrack.pause();
        } else {
            currentTrack.play();
        }
        setIsPlaying(!isPlaying);
    }

    $(playPause).on("click", function () {
        togglePlayPause()
    });
})

