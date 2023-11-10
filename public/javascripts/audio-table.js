$(document).ready(function () {
    let selectedRow;
    let isPlaying = 0;
    let I_PlayPause = $("#play-pause");
    let playPause = $(".icons.play-pause");
    let currentTrack = document.querySelector("#current-track");
    let currentSrc = document.querySelector("#current-src");

    let playingSongId = localStorage.getItem("song-id");
    let volumeValue = localStorage.getItem("volume-value");
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
        localStorage.setItem("volume-value",volumeValue);
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
        currentTrack.volume = (volumeValue / 100);
        currentTrack.play();
        setIsPlaying(1);
        localStorage.setItem("song-id",songId);
    }
    
    function setIsPlaying(_isPlaying) {
        isPlaying = _isPlaying;
        $(I_PlayPause).removeClass("fa-play fa-pause");
        if (isPlaying) {
            $(I_PlayPause).addClass("fa-pause");
        } else {
            $(I_PlayPause).addClass("fa-play");
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
    
    $("#volume-slider").slider({
        value  : volumeValue,
        step   : 0.01,
        range  : 'min',
        min    : 0,
        max    : 100,
        change : function(){
            let value = $("#volume-slider").slider("value");
            volumeValue = value;
            currentTrack.volume = (value / 100);
        },
        slide : function(){
            let value = $("#volume-slider").slider("value");
            volumeValue = value;
            currentTrack.volume = (value / 100);
        }
    });
})

