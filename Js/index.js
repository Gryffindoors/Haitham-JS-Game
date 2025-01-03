$(document).ready(function () {
    $(".gameSelect").on("click", function (event) {
        event.preventDefault();
        const clickedItem = $(this);
        const otherItems = $(".gameSelect").not(clickedItem);

        // Step 1: The other gameSelect disappears in 1 second using an animation
        otherItems.animate({ opacity: 0 }, function () {
            otherItems.hide(); // Hide after fade-out

            // Step 2: The clicked item takes the center of the page slowly in 2 seconds
            clickedItem.css("position", "absolute"); // Ensure the clicked item can be moved
            clickedItem.animate({
                position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            transition: "ease-in-out",
            }, 2000, function () {
                // Step 3: The target href opens
                const targetHref = clickedItem.find("a").attr("href");
                window.location.href = targetHref;
            });
        });
    });
});
