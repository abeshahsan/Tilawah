$(document).ready(function () {
    let selectedRow;
    let isPlaying = 0;
    let playPause = $("#play-pause");
    let currentTrack = document.querySelector("#current-track");
    let currentSrc = document.querySelector("#current-src");

    $(".audio-row").each(function (i, element) {
        $(element).on("click", function () {
            playAudio($(element))
        })
    })

    function playAudio(row) {
        if (selectedRow) {
            selectedRow.removeClass('selected');
        }
        row.addClass('selected');
        selectedRow = row
        let songId = row.attr("id");

        currentSrc.setAttribute("src", "/song/" + songId);
        currentTrack.load();
        currentTrack.play();
        currentTrack.volume = .02
        setIsPlaying(1);
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

