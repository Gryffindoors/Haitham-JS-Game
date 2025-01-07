let anime = ["./Images/anime01.jpg", "./Images/anime02.png", "./Images/anime03.jpeg", "./Images/anime04.png", "./Images/anime05.png", "./Images/anime06.png", "./Images/anime07.jpg", "./Images/anime08.jpg", "./Images/anime09.jpg", "./Images/anime10.jpg", "./Images/anime11.jpg", "./Images/anime12.jpg"];
let cartoon = ["./Images/cartoon01.jpg", "./Images/cartoon02.png", "./Images/cartoon03.jpg", "./Images/cartoon04.jpg", "./Images/cartoon05.png", "./Images/cartoon06.png", "./Images/cartoon07.jpg", "./Images/cartoon08.png", "./Images/cartoon09.png", "./Images/cartoon10.png", "./Images/cartoon11.png", "./Images/cartoon12.jpg"];
let card = ["./Images/card01.png", "./Images/card02.png", "./Images/card03.png", "./Images/card04.png", "./Images/card05.png", "./Images/card06.png", "./Images/card07.png", "./Images/card08.png", "./Images/card09.png", "./Images/card10.png", "./Images/card11.png", "./Images/card12.png"];

let gameBoard = $("#gameBoard");
gameBoard.html("");

let selectedSize = 0;
let selectedTheme = [];
let clickCount = 0; // Global click count

let firstClick = null; // Variable to store the first clicked element
let secondClick = null; // Variable to store the second clicked element
let isProcessing = false; // Prevents additional clicks while comparing

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
let assignedImages = []; // Global variable to store the assigned images

function populateRandomElements() {
    if (selectedTheme.length === 0 || selectedSize === 0) {
        $("#infoTitle").text("Please select a theme and size first!");
        return;
    }

    // Shuffle the selected theme array
    const shuffledTheme = shuffleArray([...selectedTheme]);

    // Select exactly half the elements
    const halfSize = selectedSize / 2;
    const selectedElements = shuffledTheme.slice(0, halfSize);

    // Duplicate the selected elements and shuffle both arrays
    const firstSet = shuffleArray([...selectedElements]);
    const secondSet = shuffleArray([...selectedElements]);

    // Combine the two shuffled sets
    const combinedSet = shuffleArray([...firstSet, ...secondSet]);

    // Store the assigned images in the global variable
    assignedImages = [...combinedSet];

    // Assign images but use a placeholder initially
    for (let i = 0; i < selectedSize; i++) {
        const square = $(`#sq${i + 1} img`);
        square.attr("data-image", assignedImages[i]); // Assign the image URL as a data attribute
        square.attr("src", placeholderImage); // Set the placeholder image initially
    }

    console.log("Assigned images for later use:", assignedImages); // Debugging log
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
    clickCount = 0; // Reset move count
    let pairedCount = 0; // Track the number of paired cards

    populateRandomElements(); // Populate the board with images and placeholders

    $(".play-area").off("mouseover").on("mouseover", function () {
        $(this).css("cursor", "pointer");
    });

    // Click handler for revealing images and comparing them
    $(".play-area").off("click").on("click", function () {
        if (isProcessing) return; // Prevent clicks during comparison

        const imgElement = $(this).find("img"); // Get the image element inside the clicked play-area

        // Reveal the assigned image
        if (imgElement.attr("src") === placeholderImage) {
            imgElement.attr("src", imgElement.attr("data-image"));

            if (!firstClick) {
                // First click
                firstClick = $(this);
            } else if (!secondClick) {
                // Second click
                secondClick = $(this);

                // Increment move count
                clickCount++;
                $("#info").text("Moves: " + clickCount);

                // Compare the two clicked images
                isProcessing = true; // Block further clicks while comparing
                setTimeout(() => {
                    const firstImage = firstClick.find("img").attr("data-image");
                    const secondImage = secondClick.find("img").attr("data-image");

                    if (firstImage === secondImage) {
                        // Match: Disable further clicks for these squares
                        firstClick.off("click");
                        secondClick.off("click");
                        pairedCount++; // Increment paired count
                        console.log("Match found!");

                        // Check for game over
                        if (pairedCount === selectedSize / 2) {
                            gameOver(); // Trigger the win function
                        }
                    } else {
                        // No match: Reset to placeholder image
                        firstClick.find("img").attr("src", placeholderImage);
                        secondClick.find("img").attr("src", placeholderImage);
                        console.log("No match, resetting...");
                    }

                    // Reset click tracking variables
                    firstClick = null;
                    secondClick = null;
                    isProcessing = false; // Allow further clicks

                    // Save move count to local storage after each comparison
                    saveMoveCount(selectedSize, clickCount);
                }, 1000); // Delay for better user experience
            }
        }
    });
});

// Save move count to local storage
function saveMoveCount(size, moves) {
    const highScoreKey = `highScore-${size}`; // Key based on size
    const currentHighScore = localStorage.getItem(highScoreKey);

    // Update only if it's the first high score or the current score is lower
    if (!currentHighScore || moves < parseInt(currentHighScore)) {
        localStorage.setItem(highScoreKey, moves); // Save new high score
        $(`#highScore${size}`).text(`High Score for size ${size}: ${moves}`); // Update UI
        console.log(`New high score for size ${size} saved: ${moves}`);
    }
}

// Game Over Function
function gameOver() {
    $("#infoTitle").text("You Win!");
    $("#info").html(`Moves: ${clickCount}`); // Show the final move count
    console.log("Game over! You won in " + clickCount + " moves.");

    // Save the high score when the game ends
    saveMoveCount(selectedSize, clickCount);

    // Display win message
    $(".win-message").html(`
        <h4>Congratulations!</h4>
        <h6>You won in ${clickCount} moves!</h6>
    `).fadeIn(500);
}

// Start button click handler
$("#startBtn").click(function () {
    $("#board").removeClass("text-bg-danger text-bg-secondary").addClass("text-bg-warning");
    $("#board").fadeIn(1500);
    $("#infoTitle").text("Game Started");
    clickCount = 0; // Reset move count
    let pairedCount = 0; // Track the number of paired cards

    populateRandomElements(); // Populate the board with images and placeholders

    $(".play-area").off("mouseover").on("mouseover", function () {
        $(this).css("cursor", "pointer");
    });

    // Click handler for revealing images and comparing them
    $(".play-area").off("click").on("click", function () {
        if (isProcessing) return; // Prevent clicks during comparison

        const imgElement = $(this).find("img"); // Get the image element inside the clicked play-area

        // Reveal the assigned image
        if (imgElement.attr("src") === placeholderImage) {
            imgElement.attr("src", imgElement.attr("data-image"));

            if (!firstClick) {
                // First click
                firstClick = $(this);
            } else if (!secondClick) {
                // Second click
                secondClick = $(this);

                // Increment move count
                clickCount++;
                $("#info").text("Moves: " + clickCount);

                // Compare the two clicked images
                isProcessing = true; // Block further clicks while comparing
                setTimeout(() => {
                    const firstImage = firstClick.find("img").attr("data-image");
                    const secondImage = secondClick.find("img").attr("data-image");

                    if (firstImage === secondImage) {
                        // Match: Disable further clicks for these squares
                        firstClick.off("click");
                        secondClick.off("click");
                        pairedCount++; // Increment paired count
                        console.log("Match found!");

                        // Save move count after every match
                        saveMoveCount(selectedSize, clickCount);

                        // Check for game over
                        if (pairedCount === selectedSize / 2) {
                            gameOver(); // Trigger the win function
                        }
                    } else {
                        // No match: Reset to placeholder image
                        firstClick.find("img").attr("src", placeholderImage);
                        secondClick.find("img").attr("src", placeholderImage);
                        console.log("No match, resetting...");
                    }

                    // Reset click tracking variables
                    firstClick = null;
                    secondClick = null;
                    isProcessing = false; // Allow further clicks
                }, 1000); // Delay for better user experience
            }
        }
    });
});
