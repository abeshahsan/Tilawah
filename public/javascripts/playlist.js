$(document).ready(function(){
    let plusIcon = $(".new-playlist");
    let overlayInNewPlaylist = document.querySelector("#overlay-in-new-playlist");
    let newPlaylist = document.querySelector("#new-playlist");
    let modalInput = document.querySelector("#playlist-name");


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
    
    function clearModal(){
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
        if(event.key === "Escape") {
            closeModal()
        }
    });
    
    $("#new-playlist-form").validate({
        rules:{
            
        },
        messages: {
            playlistName: {
                required: "Please enter a valid name"
            }
        },
        submitHandler: function(form){
            $.ajax({
                type: $(form).attr('method'),
                url: $(form).attr('action'),
                data: $(form).serialize(),
                dataType : 'json'
            })
                .done(function (success) {
                    if (success == true) { 
                        clearModal();
                        closeModal();
                    } else {
                        alert('Something went wrong');
                    }
                });
        },
    });


});