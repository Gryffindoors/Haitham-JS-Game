let iconX = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="w-50 text-success" fill="currentColor">
                <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
            </svg>`;
let iconO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-50 text-danger" fill="currentColor">
                <path d="M224 96a160 160 0 1 0 0 320 160 160 0 1 0 0-320zM448 256A224 224 0 1 1 0 256a224 224 0 1 1 448 0z" />
            </svg>`;

let player1 = []; // Player 1 moves
let player2 = []; // Player 2 moves

let clickCount = 0; // Click counter

let winConditions = [
    ["a1", "a2", "a3"],
    ["b1", "b2", "b3"],
    ["c1", "c2", "c3"],
    ["a1", "b1", "c1"],
    ["a2", "b2", "c2"],
    ["a3", "b3", "c3"],
    ["a1", "b2", "c3"],
    ["a3", "b2", "c1"]
]; // Winning conditions

function checkWin(playerMoves) {
    // Loop through each win condition
    for (let condition of winConditions) {
        // Check if all elements of the condition are in playerMoves
        if (condition.every(move => playerMoves.includes(move))) {
            $(".play-area").off("click"); // no more clicks
            return true; // Player wins
        }
    }
    return false; // No winner
}


$("#startBtn").click(function () {
    // Reset the board class
    $("#board").removeClass("text-bg-danger text-bg-secondary").addClass("text-bg-warning");

    // Show the board
    $("#board").fadeIn(1000);
    
    // Reset game info
    $("#infoTitle").text("Game Started");
    $("#info").text("Player 1's Turn");

    // Reset game variables
    player1 = [];
    player2 = [];
    clickCount = 0;

    // Clear play areas
    $(".play-area").html("").off("click").off("mouseover");

    // Activate the game
    $(".play-area").on("mouseover", function () {
        $(this).css("cursor", "pointer");
    });

    $(".play-area").on("click", function () {
        clickCount++;
        if (clickCount % 2 == 0) {
            $(this).html(iconO);
            player2.push($(this).attr("id"));
            $("#info").text("Player 1's Turn");
            if (checkWin(player2)) {
                $("#board").removeClass("text-bg-warning").addClass("text-bg-danger");
                $("#infoTitle").text("Game Over");
                $("#info").text("Player 2 Wins!");
                $(".play-area").off("click"); // Stop game
            }
        } else {
            $(this).html(iconX);
            player1.push($(this).attr("id"));
            $("#info").text("Player 2's Turn");
            if (checkWin(player1)) {
                $("#board").removeClass("text-bg-warning").addClass("text-bg-danger");
                $("#infoTitle").text("Game Over");
                $("#info").text("Player 1 Wins!");
                $(".play-area").off("click"); // Stop game
            }
        }

        // Check for a draw
        if (clickCount === 9 && !checkWin(player1) && !checkWin(player2)) {
            $("#board").removeClass("text-bg-warning").addClass("text-bg-secondary");
            $("#infoTitle").text("Game Over");
            $("#info").text("It's a Draw!");
            $(".play-area").off("click"); // Stop game
        }

        $(this).off("click"); // Prevent further clicks on the same square
    });
});

$("#resetBtn").click(function () {
    // Hide the board
    $("#board").fadeOut(4000);

    // Reset game info
    $("#infoTitle").text("Game Stopped");
    $("#info").text("Press Start to Play");

    // Reset game variables
    player1 = [];
    player2 = [];
    clickCount = 0;

    // Clear play areas
    $(".play-area").html("").off("click").off("mouseover");
});

