let sets = ["rock", "paper", "scissors"];
let setImages = ["./Images/Rock.jpg", "./Images/Paper.jpg", "./Images/Scissors.jpg"];

// Function to handle hover behavior
function attachHoverBehavior() {
    $("#rock, #paper, #scissors, #lucky").hover(
        function () {
            $(this).find(".over-hover").removeClass("d-none").slideDown(1500);
        },
        function () {
            $(this).find(".over-hover").slideUp(1500, function () {
                $(this).addClass("d-none");
            });
        }
    );
};

// Function to handle click behavior
function attachClickBehavior() {
    $("#rock, #paper, #scissors").click(function () {
        // Remove both click and hover event handlers
        $(".col-6").off("click mouseenter mouseleave");
        $(".over-hover").slideUp(1500, function () {
            $(this).addClass("d-none");
        });

        // Perform the click action
        $(this).find(".selected").removeClass("d-none");

        // Choose the computer's hand
        let randomIndexs = Math.floor(Math.random() * sets.length);

        // Use the random index to reference both arrays
        let computerSet = sets[randomIndexs];
        let computerImage = setImages[randomIndexs];

        // Update the computer's hand image
        $("#rulesImg").attr("src", computerImage);

        // Determine the winner
        let playerSet = $(this).attr("id");

        if (playerSet === computerSet) {
            $("#infoTitle").text("It's a tie!");
        } else if (
            (playerSet === "rock" && computerSet === "scissors") ||
            (playerSet === "paper" && computerSet === "rock") ||
            (playerSet === "scissors" && computerSet === "paper")
        ) {
            $("#infoTitle").text("You win!");
            $("#board").removeClass("text-bg-warning").addClass("text-bg-success");
        } else {
            $("#infoTitle").text("You lose!");
            $("#board").removeClass("text-bg-warning").addClass("text-bg-danger");
        }
    });

    // Lucky button click behavior
    $("#lucky").click(function () {
        let randomIndex = Math.floor(Math.random() * sets.length);
        let randomSetId = `#${sets[randomIndex]}`;
        $(randomSetId).trigger("click");
    });
}

// Start Game Button
$("#startBtn").click(function () {
    // Reset the game state
    $(".selected").addClass("d-none");
    $(".over-hover").addClass("d-none");
    $("#board").removeClass("text-bg-success text-bg-danger").addClass("text-bg-warning");
    $("#infoTitle").text("Choose your hand");
    $("#rulesImg").attr("src", "./Images/RPS Rules.png");

    // Attach hover and click behaviors
    attachHoverBehavior();
    attachClickBehavior();
});
