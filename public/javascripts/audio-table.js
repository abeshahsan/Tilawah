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
    let isPlaying = 0;
    let I_PlayPause = $("#play-pause");
    let divPlayPauseIcon = $(".icons.play-pause");
    let currentTrack = document.querySelector("#current-track");
    let currentSrc = document.querySelector("#current-src");

    let playingAudioId = localStorage.getItem("audio-id");
    if (!playingAudioId) playingAudioId = 0;
    let volumeValue = localStorage.getItem("volume-value");
    let manualSeek = false;
    let seekSlider = $("#seek-slider");

    let audioElapsedTime = $(".audio-progress .elapsed");
    let audioDuration = $(".audio-progress .duration");
    let divShuffleIcon = $(".icons.shuffle");
    let divLoopIcon = $(".icons.loop");

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
        if (loop == LOOP_CURRENT_AUDIO) {
            playAudio(playingAudioId);
        } else {
            playNext();
        }
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
        }


        $(element).on("mouseup", function (event) {
            switch (event.which) {
                case 1:
                    extractAudioIDsFromTable();
                    playAudio($(element).attr("id"));
                    $(element).addClass("selected");
                    currentAudioIndex = i;
                    break;
            }
        });
    });

    try {
        setAudioDetailsInControlPanel();
    } catch (e) {
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

    function playAudio(audioId) {

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

    function playNext() {
        console.log(playlistAudioArray[currentAudioIndex]);
        if (loop == LOOP_CURRENT_PLAYLIST) {
            currentAudioIndex = (currentAudioIndex + 1) % playlistAudioArray.length;
            playAudio(playlistAudioArray[currentAudioIndex]);
        } else if (currentAudioIndex + 1 < playlistAudioArray.length) {
            currentAudioIndex++;
            playAudio(playlistAudioArray[currentAudioIndex]);
        } else if (currentAudioIndex + 1 == playlistAudioArray.length) {
            togglePlayPause();
        }
    }

    $(".icons.next").on("mouseup", function (event) {
        playNext();
    })

    $(".icons.prev").on("mouseup", function (event) {

        if (loop == LOOP_CURRENT_PLAYLIST) {
            currentAudioIndex = (currentAudioIndex - 1 + playlistAudioArray.length) % playlistAudioArray.length;
            playAudio(playlistAudioArray[currentAudioIndex]);
        } else if (currentAudioIndex - 1 >= 0) {
            currentAudioIndex--;
            playAudio(playlistAudioArray[currentAudioIndex]);
        }
    });

    function applyShuffle() {
        playlistAudioArray.sort(() => (Math.random() > .3) ? 1 : -1);
    }

    function removeShuffle() {
        playlistAudioArray = JSON.parse(JSON.stringify(unshuffledPlaylistAudioArray));
    }

    if (localStorage.getItem("shuffle") == SHUFFLE_ON) {
        $(divShuffleIcon).addClass("active");
        divShuffleIcon.tooltip({
            content: "Shuffle on"
        });
        applyShuffle()
    }

    divShuffleIcon.on("click", function () {
        if (localStorage.getItem("shuffle") == SHUFFLE_OFF) {
            localStorage.setItem("shuffle", SHUFFLE_ON);
            $(divShuffleIcon).addClass("active");
            divShuffleIcon.tooltip({
                content: "Shuffle on"
            });
            applyShuffle()
        } else {
            localStorage.setItem("shuffle", SHUFFLE_OFF);
            $(divShuffleIcon).removeClass("active");
            divShuffleIcon.tooltip({
                content: "Shuffle off"
            });
            removeShuffle();
        }
    });

    loop = localStorage.getItem("loop");
    if (!loop) loop = NO_LOOP;

    $("#repeat-badge").text(loop);
    setTooltipForLoop(divLoopIcon);

    function setTooltipForLoop() {
        if (loop == NO_LOOP) {
            divLoopIcon.tooltip({
                content: "No loop"
            });
        } else if (loop == LOOP_CURRENT_PLAYLIST) {
            divLoopIcon.tooltip({
                content: "Loop this playlist"
            });
        } else {
            divLoopIcon.tooltip({
                content: "Loop this audio"
            });
        }
    }

    divLoopIcon.on("click", function () {

        loop = (loop + 1) % 3;
        localStorage.setItem("loop", loop);
        $("#repeat-badge").text(loop);

        setTooltipForLoop();
    });

    function formatProgressTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        minutes = (minutes <= 9 ? `0${minutes}` : `${minutes}`);
        seconds = seconds % 60;
        seconds = (seconds <= 9 ? `0${seconds}` : `${seconds}`);
        return `${minutes}:${seconds}`;
    }

    async function extractAudioIDsFromTable() {
        playlistAudio = {};
        playlistAudioArray = [];

        $(".audio-row").each(function (i, element) {

            playlistAudioArray[i] = $(element).attr("id");
            playlistAudio[$(element).attr("id")] = {
                name: $(element).find(".title").text(),
                creator: $(element).find(".creator").text(),
                collection: $(element).find(".collection").text()
            }

        });
        unshuffledPlaylistAudioArray = JSON.parse(JSON.stringify(playlistAudioArray));
        if (localStorage.getItem("shuffle") == SHUFFLE_ON) applyShuffle();
    }
});
