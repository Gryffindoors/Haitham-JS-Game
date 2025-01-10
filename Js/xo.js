// Updated JavaScript for XO Game with Winning Line Fix

const iconX = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="w-50 text-success" fill="currentColor">
    <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8-9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
</svg>`;

const iconO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-50 text-danger" fill="currentColor">
    <path d="M224 96a160 160 0 1 0 0 320 160 160 0 1 0 0-320zM448 256A224 224 0 1 1 0 256a224 224 0 1 1 448 0z" />
</svg>`;

let player1 = []; // Player 1 moves
let player2 = []; // Player 2 moves
let clickCount = 0; // Click counter

const winConditions = [
    ["a1", "a2", "a3"],
    ["b1", "b2", "b3"],
    ["c1", "c2", "c3"],
    ["a1", "b1", "c1"],
    ["a2", "b2", "c2"],
    ["a3", "b3", "c3"],
    ["a1", "b2", "c3"],
    ["a3", "b2", "c1"]
];

function drawWinningLine(condition) {
    const grid = document.querySelector(".row"); // Parent container of the grid
    const cell1 = document.getElementById(condition[0]);
    const cell2 = document.getElementById(condition[2]);

    const line = document.createElement("div");
    line.classList.add("winning-line");

    // Calculate positions
    const rect1 = cell1.getBoundingClientRect();
    const rect2 = cell2.getBoundingClientRect();

    const x1 = rect1.left + rect1.width / 2;
    const y1 = rect1.top + rect1.height / 2;
    const x2 = rect2.left + rect2.width / 2;
    const y2 = rect2.top + rect2.height / 2;

    // Style the line
    line.style.position = "absolute";
    line.style.backgroundColor = "red";
    line.style.width = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) + "px";
    line.style.height = "5px"; // Line thickness
    line.style.left = x1 + "px";
    line.style.top = y1 + "px";
    line.style.transform = `rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`;
    line.style.transformOrigin = "0 0";

    // Append to grid
    grid.appendChild(line);
}

function highlightWinningLine(condition) {
    condition.forEach(id => {
        document.getElementById(id).classList.add("winner");
    });
    drawWinningLine(condition);
}

function checkWin(playerMoves) {
    for (let condition of winConditions) {
        if (condition.every(move => playerMoves.includes(move))) {
            highlightWinningLine(condition);
            $(".play-area").off("click"); // Disable further clicks
            return true; // Player wins
        }
    }
    return false; // No winner
}

$("#startBtn").click(function () {
    $(".winning-line").remove(); // Remove any existing winning line
    $("#board").removeClass("text-bg-danger text-bg-secondary").addClass("text-bg-warning").fadeIn(1000);
    $("#infoTitle").text("Game Started");
    $("#info").text("Player 1's Turn");

    player1 = [];
    player2 = [];
    clickCount = 0;

    $(".play-area").html("").removeClass("winner").off("click").off("mouseover");

    $(".play-area").on("mouseover", function () {
        $(this).css("cursor", "pointer");
    });

    $(".play-area").on("click", function () {
        if ($(this).html().trim() !== "") return; // Prevent multiple clicks on the same square

        clickCount++;

        if (clickCount % 2 === 0) {
            $(this).html(iconO).hide().fadeIn(300);
            player2.push($(this).attr("id"));
            $("#info").text("Player 1's Turn");
            if (checkWin(player2)) {
                $("#board").removeClass("text-bg-warning").addClass("text-bg-danger");
                $("#infoTitle").text("Game Over");
                $("#info").text("Player 2 Wins!");
            }
        } else {
            $(this).html(iconX).hide().fadeIn(300);
            player1.push($(this).attr("id"));
            $("#info").text("Player 2's Turn");
            if (checkWin(player1)) {
                $("#board").removeClass("text-bg-warning").addClass("text-bg-danger");
                $("#infoTitle").text("Game Over");
                $("#info").text("Player 1 Wins!");
            }
        }

        if (clickCount === 9 && !checkWin(player1) && !checkWin(player2)) {
            $("#board").removeClass("text-bg-warning").addClass("text-bg-secondary");
            $("#infoTitle").text("Game Over");
            $("#info").text("It's a Draw!");
        }

        $(this).off("click"); // Prevent further clicks on this square
    });
});

$("#resetBtn").click(function () {
    $("#board").fadeOut(400);
    $("#infoTitle").text("Game Stopped");
    $("#info").text("Press Start to Play");
    player1 = [];
    player2 = [];
    clickCount = 0;
    $(".play-area").html("").removeClass("winner").off("click").off("mouseover");
    $(".winning-line").remove(); // Remove the winning line
});
