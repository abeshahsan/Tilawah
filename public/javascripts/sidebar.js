
$(document).ready(function() {
    let sidebar = $(".sidebar");
    $(sidebar).tooltip({
        tooltipClass: "sidebar-tooltip",
        position: {
            my: "center bottom-5",
            at: "top center"
        }
    });
});