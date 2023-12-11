$(document).ready(function () {
    let plusIcon = $(".new-playlist");
    let overlayInNewPlaylist = $("#overlay-in-new-playlist");
    let newPlaylist = $("#new-playlist");
    let modalInput = $("#playlist-name");
    let playlistItems = $(".playlist-menu-items");

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
});