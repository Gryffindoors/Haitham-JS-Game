$(document).ready(function () {
    $(".gameSelect").on("click", function (event) {
        event.preventDefault();
        const $clickedItem = $(this);

        // Disable further clicks during the animation
        if ($clickedItem.hasClass("animating")) return;
        $clickedItem.addClass("animating");

        const targetHref = $clickedItem.find("a").attr("href");

        // Scale up to 150%
        $clickedItem.css({
            transition: "transform 0.5s ease-in-out",
            transform: "scale(1.5)"
        });

        // After scaling up, scale down to 0% and navigate
        setTimeout(function () {
            $clickedItem.css({
                transition: "transform 0.5s ease-in-out",
                transform: "scale(0)"
            });

            // Navigate to the target page after the scale-down animation
            setTimeout(function () {
                window.location.href = targetHref;
            }, 500); // Duration matches the scale-down transition
        }, 500); // Duration matches the scale-up transition
    });
});
