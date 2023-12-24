$(document).ready(function () {
    let selectedRow;
    let isPlaying = 0;
    let I_PlayPause = $("#play-pause");
    let divPlayPauseIcon = $(".icons.play-pause");
    let currentTrack = document.querySelector("#current-track");
    let currentSrc = document.querySelector("#current-src");

    let playingSongId = localStorage.getItem("song-id");
    let volumeValue = localStorage.getItem("volume-value");
    let manualSeek = false;
    let seekSlider = $("#seek-slider");

    let audioElapsedTime = $(".audio-progress .elapsed");
    let audioDuration = $(".audio-progress .duration");

    let songArray = {};

    $(seekSlider).slider({
        value: currentTrack.currentTime,
        range: "min",
        min: 0,
        max: currentTrack.duration,
        step: 0.1,
        // animate: true,
        slide: function (event, ui) {
            // console.log($("#seek-slider").slider("option", "max"));
            manualSeek = true;
        },
        stop: function () {
            currentTrack.currentTime = $(seekSlider).slider("value");
            manualSeek = false;
        }
    });
    let sliderWidget = $('#seek-slider').slider("widget");

    currentTrack.onloadedmetadata = function () {
        $("#seek-slider").slider("option", {max: Math.floor(currentTrack.duration)});
        audioDuration.text(formatProgressTime(Math.floor(currentTrack.duration)));
    };

    currentTrack.addEventListener("ended", function () {
        togglePlayPause()
    })

    if (localStorage.getItem("page-reloaded") == "1") {
        localStorage.setItem("page-reloaded", "0");
        currentSrc.setAttribute("src", "/song/" + playingSongId);
        currentTrack.load();
        currentTrack.currentTime = localStorage.getItem("audio-current-time");
        currentTrack.volume = volumeValue / 100;
    }

    $(".audio-row").each(function (i, element) {
        if (playingSongId == $(element).attr("id")) {
            $(element).addClass("selected");
            selectedRow = element;
        }
        songArray[$(element).attr("id")] = {
            name: $(element).find(".title").text(),
            creator: $(element).find(".creator").text(),
            collection: $(element).find(".collection").text()
        };

        $(element).on("mouseup", function (event) {
            switch (event.which) {
                case 1:
                    playAudio($(element))
                    break;
            }
        })

    });

    setSongDetailsInControlPanel();

    $('.audio-row .three-dots').on('mouseup', function (e) {
        e.preventDefault();
        $('.audio-row').contextMenu({x: e.pageX, y: e.pageY});
        e.stopPropagation();
    });


    window.onbeforeunload = function reloadHandler() {
        localStorage.setItem("page-reloaded", "1");
        localStorage.setItem("volume-value", volumeValue);
        localStorage.setItem("audio-current-time", currentTrack.currentTime);
        localStorage.setItem("song-id", playingSongId);
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
        divPlayPauseIcon.tooltip({
            content: "Pause"
        });
        localStorage.setItem("song-id", songId);
        playingSongId = songId;
        setSongDetailsInControlPanel();
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

    //using songArray was not necessary but used for convenience
    function setSongDetailsInControlPanel() {
        $(".current-song-details #name").text(songArray[playingSongId].name);
        $(".current-song-details #creator").text(songArray[playingSongId].creator);
    }

    $(".icons #next").on("mouseup", function (event) {
        if ($(selectedRow).next("tr").index() != -1)
            playAudio($(selectedRow).next("tr"));
    })

    $(".icons #prev").on("mouseup", function (event) {
        if ($(selectedRow).prev("tr").index() > 0)
            playAudio($(selectedRow).prev("tr"));
    })

    function formatProgressTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        minutes = (minutes <= 9 ? `0${minutes}` : `${minutes}`);
        seconds = seconds % 60;
        seconds = (seconds <= 9 ? `0${seconds}` : `${seconds}`);
        return `${minutes}:${seconds}`;
    }
});
