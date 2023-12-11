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

    let playlists={};
    getPlaylists();

    $(".audio-row").each(function (i, element) {
        if (playingSongId == $(element).attr("id")) {
            if (localStorage.getItem("page-reloaded") == "1") {
                localStorage.setItem("page-reloaded", "0");
                currentSrc.setAttribute("src", "/song/" + playingSongId);
                currentTrack.load();
                currentTrack.volume = volumeValue / 100;
            }
            $(element).addClass("selected");
            selectedRow = element;
            updateSeekSlider();
        }
        $(element).on("mouseup", function (event) {
            console.log(event.which)
            switch (event.which) {
                case 1:
                    playAudio($(element))
                    break;
            }
        })
        $.contextMenu({
            selector: '.audio-row',
            className: 'audio-context-menu',
            autoHide: true,
            callback:function(key, options){
                // alert(key + " " + options.$trigger.attr("id"));
                let audioId = options.$trigger.attr("id");
                let playlistId = key;
                addAudioToPlaylist(audioId, playlistId);
            },
            items: {
                "addToPlaylist": {
                    name: "Add to playlist",
                    className: "add-to-playlist",
                    icon: "add",
                    autoHide: true,
                    items: playlists,
                }
            }
        });
    });

    function addAudioToPlaylist(audioId, playlistId){
        $.ajax({
            type: 'POST',
            url: '/add-audio-to-playlist',
            data: {audioId, playlistId},
            dataType : 'json',
        });
    }


    function updateSeekSlider() {
        currentTrack.onloadedmetadata = function () {
            $("#seek-slider").slider("option", {max: Math.floor(currentTrack.duration)});
            currentTrack.currentTime = localStorage.getItem("audio-current-time");
        };
    }
    window.onbeforeunload = function reloadHandler() {
        localStorage.setItem("page-reloaded", "1");
        localStorage.setItem("volume-value", volumeValue);
        localStorage.setItem("audio-current-time", currentTrack.currentTime);
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
        currentTrack.duration =
            currentTrack.play();
        currentTrack.addEventListener("ended", function () {
            togglePlayPause()
        })
        setIsPlaying(1);
        divPlayPauseIcon.tooltip({
            content: "Pause"
        });
        localStorage.setItem("song-id", songId);
        updateSeekSlider();
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
    $(seekSlider).slider({
        value: currentTrack.currentTime,
        range: "min",
        min: 0,
        // max: 100,
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

    $(currentTrack).on('timeupdate', function () {
        if (!manualSeek) {
            $(seekSlider).slider('value', currentTrack.currentTime);
        }
    });

    $(".controls .icons").tooltip({
        tooltipClass: "control-panel-tooltip"
    });

    function getPlaylists(){
        
        $.ajax({
            type: 'GET',
            url: '/get-playlists',
            dataType : 'json',
            async: false
        })
            .done(function (res) {
            res.playlists.forEach(elem=>{
                playlists[(elem.id).toString()]={
                    name: elem.name,
                    
                }
                            
            });
            console.log(playlists)
        })
    }
});
    
    