$(document).ready(function () {
    let plusIcon = $(".new-playlist");
    let overlayInNewPlaylist = $("#overlay-in-new-playlist");
    let newPlaylist = $("#new-playlist");
    let modalInput = $("#playlist-name");
    let playlistItems = $(".playlist-menu-items");

    let playlists = {};
    getPlaylists();

    let currentPlaylistId;

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
                        addPlaylistToSidebar(response.playlist);
                        addPlaylistToContextMenu(response.playlist);
                        
                    } else {
                        alert('Something went wrong');
                    }
                });
        },
    });

    function addPlaylistToSidebar(playlist) {
        let li = $('<li/>');
        $(li).append(document.createTextNode(playlist.name));
        $(li).attr("id", playlist.id);
        $(li).attr("class", "item");
        $(playlistItems).append(li);
        $(li).on("mouseup", function (event) {
            switch (event.which) {
                case 1:
                    getPlaylistAudio(playlist.id);
                    break;
            }
        });
    }


    $(".item").on("mouseup", function (event) {
        switch (event.which) {
            case 1:
                let playlistId = $(this).attr("id");
                getPlaylistAudio(playlistId);
                break;
        }
    });

    function getPlaylistAudio(playlistId) {

        currentPlaylistId = playlistId;
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
        trigger: 'right',
        build: function($triggerElement, e){
            return {
                className: 'audio-context-menu',            
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
                        items: Playlists(),
                        visible: function(key, opt){
                            return true;
                        },
                    },
                    "deleteFromPlaylist":{
                        name: "Delete from this playlist",
                        className: "delete-from-playlist",
                        icon: "delete",
                        visible: function(key, opt){
                            return window.location.pathname != '/';
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
            type: 'POST',
            url: '/get-playlists',
            dataType : 'json',
            async: false
        })
            .done(function (res) {
                res.playlists.forEach(elem=>{

                    playlists[(elem.id).toString()]={
                        name: elem.name,
                        visible: function(){return true;}
                    }                            
                });
                console.log(playlists)
            })
    }


    function addPlaylistToContextMenu(playlist){

        playlists[(playlist.id).toString()] = {
            
            name: playlist.name,

        }
    }


    function removePlaylistFromContextMenu(playlistId){

        delete playlists[playlistId.toString()];

    }


    function Playlists(){
        // getPlaylists();
        let toShow = JSON.parse(JSON.stringify(playlists));

        if(window.location.pathname.indexOf('playlist') !=-1)
            toShow[currentPlaylistId.toString()].visible = function(){return false;}

        console.log(currentPlaylistId);

        return toShow;
    }


    $.contextMenu({

        selector: '.playlist-menu-items .item',

        className: 'sidebar-playlist-context-menu',            

        callback:function(key, options){

            let playlistId = options.$trigger.attr("id");

            if(key == "deletePlaylist") {

                deletePlaylist(playlistId);

            }
        },
        items: {

            "deletePlaylist":{

                name: "Delete playlist",
                className: "delete-playlist",
                icon: "delete",
                autoHide: true,
            },
        },
    });

    function deletePlaylist(playlistId){
        $.ajax({
            type: 'POST',
            url: '/delete-playlist/' + playlistId,
            async: false
        })
        .done(function(res){
            $('.playlist-menu-items #' + playlistId).remove();
            removePlaylistFromContextMenu(playlistId);
            if(currentPlaylistId == playlistId){
                loadHome();
            }
        });
    }
    function loadHome() {
        $.post("/home", function (res) {
            $(".main-container").html(res.html);
            if (res.loginRegister) loginRegisterDiv.removeClass("hidden");
            else $(".login-register").addClass("hidden");
            $(".sidebar").removeClass("hidden");
            history.pushState("home", "", "/");
        });
    }
    
});