$(document).ready(function(){
    let plusIcon = $(".new-playlist");
    let overlayInNewPlaylist = document.querySelector("#overlay-in-new-playlist");
    let newPlaylist = document.querySelector("#new-playlist");


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
});