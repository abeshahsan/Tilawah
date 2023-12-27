$(document).ready(function () {

    /**
     * In the beginning, load the last playlist the user was playing.
     * Save all audio ID in playlistAudio array.
     * It's declared in index.js
     */

    let divPlaylistID = $(".audio-table-current-playlist");
    let playlistID;

    playlistID = window.location.pathname.split("/")[2];
    divPlaylistID.text(playlistID);

    console.log(playlistAudio);


    let selectedRow;
    let isPlaying = 0;
    let I_PlayPause = $("#play-pause");
    let divPlayPauseIcon = $(".icons.play-pause");
    let currentTrack = document.querySelector("#current-track");
    let currentSrc = document.querySelector("#current-src");

    let playingAudioId = localStorage.getItem("audio-id");
    if(!playingAudioId) playingAudioId = 0;
    let volumeValue = localStorage.getItem("volume-value");
    let manualSeek = false;
    let seekSlider = $("#seek-slider");

    let audioElapsedTime = $(".audio-progress .elapsed");
    let audioDuration = $(".audio-progress .duration");
    let divShuffleIcon = $(".icons.shuffle");

    $(seekSlider).slider({
        value: currentTrack.currentTime,
        range: "min",
        min: 0,
        max: currentTrack.duration,
        step: 0.1,
        // animate: true,
        slide: function (event, ui) {
            manualSeek = true;
        },
        stop: function () {
            currentTrack.currentTime = $(seekSlider).slider("value");
            manualSeek = false;
        }
    });
    $('#seek-slider').slider("widget");
    currentTrack.onloadedmetadata = function () {
        $("#seek-slider").slider("option", {max: Math.floor(currentTrack.duration)});
        audioDuration.text(formatProgressTime(Math.floor(currentTrack.duration)));
    };

    currentTrack.addEventListener("ended", function () {
        togglePlayPause()
    })

    if (localStorage.getItem("page-reloaded") == "1") {
        localStorage.setItem("page-reloaded", "0");
        currentSrc.setAttribute("src", "/song/" + playingAudioId);
        currentTrack.load();
        currentTrack.currentTime = localStorage.getItem("audio-current-time");
        currentTrack.volume = volumeValue / 100;
    }

    $(".audio-row").each(function (i, element) {
        if (playingAudioId == $(element).attr("id")) {
            $(element).addClass("selected");
            selectedRow = element;
        }

        $(element).on("mouseup", function (event) {
            switch (event.which) {
                case 1:
                    extractAudioIDsFromTable();
                    playAudio($(element));
                    break;
            }
        });
    });

    try {
        setAudioDetailsInControlPanel();
    }catch (e) {
        console.log(e)
    }

    $('.audio-row .three-dots').on('mouseup', function (e) {
        e.preventDefault();
        $('.audio-row').contextMenu({x: e.pageX, y: e.pageY});
        e.stopPropagation();
    });

    localStorage.user = {}
    window.onbeforeunload = function reloadHandler() {
        localStorage.setItem("page-reloaded", "1");
        localStorage.setItem("volume-value", volumeValue);
        localStorage.setItem("audio-current-time", currentTrack.currentTime);
        localStorage.setItem("audio-id", playingAudioId);
    }

    function playAudio(row) {
        if (selectedRow) {
            $(selectedRow).removeClass('selected');
        }
        $(row).addClass('selected');
        selectedRow = row
        let audioId = $(row).attr("id");

        currentSrc.setAttribute("src", "/song/" + audioId);
        currentTrack.load();
        currentTrack.volume = (volumeValue / 100);
        currentTrack.play();
        setIsPlaying(1);
        divPlayPauseIcon.tooltip({
            content: "Pause"
        });
        localStorage.setItem("audio-id", audioId);
        playingAudioId = audioId;
        setAudioDetailsInControlPanel();
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
            divPlayPauseIcon.tooltip({
                content: "Play"
            });
        } else {
            currentTrack.play();
            divPlayPauseIcon.tooltip({
                content: "Pause"
            });
        }
        setIsPlaying(!isPlaying);
    }

    $(divPlayPauseIcon).on("click", function () {
        togglePlayPause()
    });

    $("#volume-slider").slider({
        value: volumeValue,
        step: 0.01,
        range: 'min',
        min: 0,
        max: 100,
        change: function () {
            let value = $("#volume-slider").slider("value");
            volumeValue = value;
            currentTrack.volume = (value / 100);
        },
        slide: function () {
            let value = $("#volume-slider").slider("value");
            volumeValue = value;
            currentTrack.volume = (value / 100);
        }
    });

    $(currentTrack).on('timeupdate', function () {
        if (!manualSeek) {
            $(seekSlider).slider('value', currentTrack.currentTime);
            audioElapsedTime.text(formatProgressTime(Math.floor(currentTrack.currentTime)));
        }
    });

    $(".controls .icons").tooltip({
        tooltipClass: "control-panel-tooltip"
    });

    //using playlistAudio was not necessary but used for convenience
    function setAudioDetailsInControlPanel() {
        $(".current-audio-details #name").text(playlistAudio[playingAudioId].name);
        $(".current-audio-details #creator").text(playlistAudio[playingAudioId].creator);
    }

    $(".icons #next").on("mouseup", function (event) {
        if ($(selectedRow).next("tr").index() != -1)
            playAudio($(selectedRow).next("tr"));
    })

    $(".icons #prev").on("mouseup", function (event) {
        if ($(selectedRow).prev("tr").index() > 0)
            playAudio($(selectedRow).prev("tr"));
    })

    divShuffleIcon.on("click", function () {
        if (localStorage.user.shuffle) {
            localStorage.user.shuffle = false;
        } else {
            localStorage.user.shuffle = true;
        }
    })

    function formatProgressTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        minutes = (minutes <= 9 ? `0${minutes}` : `${minutes}`);
        seconds = seconds % 60;
        seconds = (seconds <= 9 ? `0${seconds}` : `${seconds}`);
        return `${minutes}:${seconds}`;
    }

    async function extractAudioIDsFromTable() {
        $(".audio-row").each(function (i, element) {
            playlistAudio[$(element).attr("id")] = {
                name: $(element).find(".title").text(),
                creator: $(element).find(".creator").text(),
                collection: $(element).find(".collection").text()
            };
        });
    }
});
