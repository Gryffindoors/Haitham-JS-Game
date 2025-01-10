// Optimized JavaScript for Memory Game

let anime = ["./Images/anime01.jpg", "./Images/anime02.png", "./Images/anime03.jpeg", "./Images/anime04.png", "./Images/anime05.png", "./Images/anime06.png", "./Images/anime07.jpg", "./Images/anime08.jpg", "./Images/anime09.jpg", "./Images/anime10.jpg", "./Images/anime11.jpg", "./Images/anime12.jpg"];
let cartoon = ["./Images/cartoon01.jpg", "./Images/cartoon02.png", "./Images/cartoon03.jpg", "./Images/cartoon04.jpg", "./Images/cartoon05.png", "./Images/cartoon06.png", "./Images/cartoon07.jpg", "./Images/cartoon08.png", "./Images/cartoon09.png", "./Images/cartoon10.png", "./Images/cartoon11.png", "./Images/cartoon12.jpg"];
let card = ["./Images/card01.png", "./Images/card02.png", "./Images/card03.png", "./Images/card04.png", "./Images/card05.png", "./Images/card06.png", "./Images/card07.png", "./Images/card08.png", "./Images/card09.png", "./Images/card10.png", "./Images/card11.png", "./Images/card12.png"];

let gameBoard = $("#gameBoard");
gameBoard.html("");

let selectedSize = 0;
let selectedTheme = [];
let clickCount = 0; // Global click count

let firstClick = null;
let secondClick = null;
let isProcessing = false;
const placeholderImage = "./Images/decoration.jpg";

// Shuffle array elements
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Populate random elements
let assignedImages = [];

function populateRandomElements() {
    if (selectedTheme.length === 0 || selectedSize === 0) {
        $("#infoTitle").text("Please select a theme and size first!");
        return;
    }

    const shuffledTheme = shuffleArray([...selectedTheme]);
    const halfSize = selectedSize / 2;
    const selectedElements = shuffledTheme.slice(0, halfSize);
    const combinedSet = shuffleArray([...selectedElements, ...selectedElements]);

    assignedImages = [...combinedSet];

    for (let i = 0; i < selectedSize; i++) {
        const square = $(`#sq${i + 1} img`);
        square.attr("data-image", assignedImages[i]);
        square.attr("src", placeholderImage);
    }
}

// Event listener for size selection
$(".sizeIndex").click(function () {
    selectedSize = parseInt(this.id);
    if (selectedSize % 2 !== 0 || selectedSize <= 0) {
        console.error("Invalid size selected!");
        return;
    }

    gameBoard.html("");
    $("#game").removeClass("d-none");

    for (let i = 0; i < selectedSize; i++) {
        gameBoard.append(`
            <div class="col-3 p-2">
                <div id="sq${i + 1}" 
                    class="play-area overflow-hidden rounded-2 bg-transparent d-flex align-items-center justify-content-center">
                    <img src="${placeholderImage}" class="w-100">
                </div>
            </div>
        `);
    }
});

// Event listener for theme selection
$("#theme .dropdown-item").click(function () {
    const theme = this.textContent.trim().toLowerCase();
    switch (theme) {
        case "anime":
            selectedTheme = anime;
            break;
        case "cartoon":
            selectedTheme = cartoon;
            break;
        case "numbers":
            selectedTheme = card;
            break;
    }
});

// Start button click handler
$("#startBtn").click(function () {
    $("#board").removeClass("text-bg-danger text-bg-secondary").addClass("text-bg-warning");
    $("#board").fadeIn(1500);
    $("#infoTitle").text("Game Started");
    clickCount = 0;
    let pairedCount = 0;

    populateRandomElements();

    $(".play-area").off("mouseover").on("mouseover", function () {
        $(this).css("cursor", "pointer");
    });

    $(".play-area").off("click").on("click", function () {
        if (isProcessing) return;

        const imgElement = $(this).find("img");
        if (imgElement.attr("src") === placeholderImage) {
            imgElement.attr("src", imgElement.attr("data-image"));

            if (!firstClick) {
                firstClick = $(this);
            } else if (!secondClick) {
                secondClick = $(this);
                clickCount++;
                $("#info").text("Moves: " + clickCount);

                isProcessing = true;
                setTimeout(() => {
                    const firstImage = firstClick.find("img").attr("data-image");
                    const secondImage = secondClick.find("img").attr("data-image");

                    if (firstImage === secondImage) {
                        firstClick.off("click");
                        secondClick.off("click");
                        pairedCount++;

                        if (pairedCount === selectedSize / 2) {
                            gameOver();
                        }
                    } else {
                        firstClick.find("img").attr("src", placeholderImage);
                        secondClick.find("img").attr("src", placeholderImage);
                    }

                    firstClick = null;
                    secondClick = null;
                    isProcessing = false;
                }, 500); // Reduced delay for mobile usability
            }
        }
    });
});

// Save move count to local storage
function saveMoveCount(size, moves) {
    const highScoreKey = `highScore-${size}`;
    const currentHighScore = localStorage.getItem(highScoreKey);

    if (!currentHighScore || moves < parseInt(currentHighScore)) {
        localStorage.setItem(highScoreKey, moves);
        $(`#highScore${size}`).text(`High Score for size ${size}: ${moves}`);
    }
}

// Game Over Function
function gameOver() {
    $("#infoTitle").text("You Win!");
    $("#info").html(`Moves: ${clickCount}`);
    saveMoveCount(selectedSize, clickCount);
    $(".win-message").html(`
        <h4>Congratulations!</h4>
        <h6>You won in ${clickCount} moves!</h6>
    `).fadeIn(500);
}
