$(document).ready(function () {
    let plusIcon = $(".new-playlist");
    let overlayInNewPlaylist = $("#overlay-in-new-playlist");
    let newPlaylist = $("#new-playlist");
    let modalInput = $("#playlist-name");
    let playlistItems = $(".playlist-menu-items");

    let playlists = {};
    getPlaylists();

    $(plusIcon).on("click", function (event) {
        openModal();
    });

    // Function to open the modal
    function openModal() {
        $(newPlaylist).css("display", "block");
        $(overlayInNewPlaylist).css("display", "block");
    }

    function closeModal() {
        $(newPlaylist).css("display", "none");
        $(overlayInNewPlaylist).css("display", "none");
    }

    function clearModal() {
        $(modalInput).val('');
    }

    // Close the modal when clicking outside the modal content or overlay
    $(overlayInNewPlaylist).click(function () {
        closeModal();
    });

    $(newPlaylist).click(function (event) {
        // Prevent clicks within the modal from closing it
        event.stopPropagation();
    });
    $(document).keydown(function (event) {
        if (event.key === "Escape") {
            closeModal()
        }
    });

    $("#new-playlist-form").validate({
        rules: {},
        messages: {
            playlistName: {
                required: "Please enter a valid name"
            }
        },
        submitHandler: function (form) {
            $.ajax({
                type: $(form).attr('method'),
                url: "/new-playlist",
                data: $(form).serialize(),
                dataType: 'json',
            })
                .done(function (response) {
                    if (response.success == true) {
                        clearModal();
                        closeModal();
                        updatePlaylistItems(response.playlist);
                        updateContextMenu(response.playlist);

                    } else {
                        alert('Something went wrong');
                    }
                });
        },
    });

    function updatePlaylistItems(playlist) {
        let li = $('<li/>');
        $(li).append(document.createTextNode(playlist.name));
        $(li).attr("id", playlist.id);
        $(li).attr("class", "item");
        $(playlistItems).append(li);
        $(li).on("mouseup", function (event) {
            // console.log(event.which)
            switch (event.which) {
                case 1:
                    getPlaylistAudio(playlist.id);
                    break;
            }
        });
    }


    $(".item").click(function (event) {
        let playlistId = $(this).attr("id");
        getPlaylistAudio(playlistId);
    });

    function getPlaylistAudio(playlistId) {
        $.ajax({
            type: 'POST',
            url: '/playlist/' + playlistId,
            data: {
                name: $(this).text()
            },
            dataType: 'json'
        })
            .done(function (response) {
                history.pushState("playlist", "", "/playlist/" + playlistId);
                $(".main-container").html(response.html);
            });
    }

    $.contextMenu({
        selector: '.audio-row',
        build: function($triggerElement, e){
            return {
                className: 'audio-context-menu',
                autoHide: true,            
                callback:function(key, options){
                    let audioId = options.$trigger.attr("id");
                    let playlistId;
                    if(key == "deleteFromPlaylist") {
                        let path = window.location.href;
                        playlistId = path.substring(path.lastIndexOf('/') + 1);
                        deleteAudioFromPlaylist(audioId, playlistId);
                    }
                    else {
                        playlistId = key;
                        addAudioToPlaylist(audioId, playlistId);
                    }
                },
                items: {
                    "addToPlaylist": {
                        name: "Add to playlist",
                        className: "add-to-playlist",
                        icon: "add",
                        autoHide: true,
                        items: loadPlaylists(),
                        visible: function(key, opt){
                            // if(window.location.pathname != '/' )
                            //     return false;
                            // else 
                            return true;
                        },
                    },
                    "deleteFromPlaylist":{
                        name: "Delete from this playlist",
                        className: "delete-from-playlist",
                        icon: "delete",
                        autoHide: true,
                        visible: function(key, opt){
                            if(window.location.pathname == '/') 
                                return false;
                            else return true;
                        }
                    },
                },
            }
        }
    });

    function addAudioToPlaylist(audioId, playlistId){
        $.ajax({
            type: 'POST',
            url: '/add-audio-to-playlist',
            data: {audioId, playlistId},
            dataType : 'json',
        })
         .done(function(res){
        });
    }
    function deleteAudioFromPlaylist(audioId, playlistId){
        $.ajax({
            type: 'POST',
            url: '/delete-audio',
            data: {audioId, playlistId},
            dataType : 'json',
        })
           .done(function(res){
            $(".audio-table #" + audioId).remove();
        });
    }

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
    function updateContextMenu(playlist){
        playlists[(playlist.id).toString()] = {
            name: playlist.name,
        }
    }
    function loadPlaylists(){
        // getPlaylists();
        return playlists;
    }
    
});