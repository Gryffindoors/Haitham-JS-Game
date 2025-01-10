// Constants
const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";
const MAX_GUESSES = 8;

// State Variables
let incorrectGuesses = 0;
let selectedCategory = null;
let selectedDifficulty = null;

// DOM Elements
const keyboard = document.getElementById("keyboardLetters");
const descriptionContainer = document.getElementById("description").querySelector("p");

// Helper Functions
const generateLetterKeys = () => {
    keyboard.innerHTML = "";
    for (let i = 65; i <= 90; i++) {
        keyboard.innerHTML += `
            <div class="col-1 p-1 my-1">
                <div class="btn btn-primary btn-lg letterBtn w-100" id="letter${String.fromCharCode(i)}">
                    ${String.fromCharCode(i)}
                </div>
            </div>`;
    }
};

const resetGameElements = () => {
    const hangmanImage = document.getElementById("hangmanImage");
    const progressBarContainer = document.getElementById("progress");
    const progressBar = document.getElementById("progressBar");
    const descriptionContainer = document.getElementById("description");
    const descriptionText = document.getElementById("descriptionText");

    hangmanImage.src = "./Images/hangman/1.png";
    hangmanImage.style.opacity = 0.5;

    progressBarContainer.classList.add("d-none");
    progressBar.style.width = "0%";
    progressBar.setAttribute("aria-valuenow", "0");
    progressBar.textContent = "100% Remaining";

    incorrectGuesses = 0;

    $(".letterBtn").each(function () {
        $(this).removeClass("text-bg-success text-bg-warning disabled-key")
            .addClass("btn-primary")
            .prop("disabled", false);
    });

    // Reset and hide the description
    descriptionText.textContent = "";
    descriptionContainer.classList.add("d-none");
};


// Fetch and Display Word Description
const fetchWordDescription = async (word) => {
    const descriptionText = document.getElementById("descriptionText");
    const descriptionContainer = document.getElementById("description");

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) throw new Error("Failed to fetch description");

        const data = await response.json();
        const firstDefinition = data[0]?.meanings?.[0]?.definitions?.[0]?.definition;

        if (firstDefinition) {
            descriptionText.textContent = firstDefinition;
            descriptionContainer.classList.remove("d-none");
        } else {
            descriptionContainer.classList.add("d-none"); // Hide if no description is available
        }
    } catch (error) {
        console.error("Error fetching word description:", error);
        descriptionContainer.classList.add("d-none"); // Hide on error
    }
};



// Update Hangman Image and Progress Bar
const updateHangmanImage = (word) => {
    incorrectGuesses++;

    const hangmanImage = document.getElementById("hangmanImage");
    const progressBarContainer = document.getElementById("progress");
    const progressBar = document.getElementById("progressBar");

    if (incorrectGuesses === 1) {
        progressBarContainer.classList.remove("d-none");
        hangmanImage.style.opacity = 1;
    }

    if (incorrectGuesses <= MAX_GUESSES) {
        hangmanImage.src = `./Images/hangman/${incorrectGuesses}.png`;

        const progressPercent = incorrectGuesses * 12.5;
        progressBar.style.width = `${progressPercent}%`;
        progressBar.setAttribute("aria-valuenow", progressPercent);
        progressBar.textContent = `${100 - progressPercent}% Remaining`;
    }

    if (incorrectGuesses === MAX_GUESSES) {
        // Reveal the full word
        [...word.toUpperCase()].forEach((char, index) => {
            const letterElement = document.getElementById(`letter${index}`);
            if (letterElement) {
                letterElement.style.visibility = "visible";
            }
        });

        disableKeyboard();
        showToast(`Game Over! The word was "${word}".`, false);
    }
};


// Populate Word Space
const populateWordSpace = (word) => {
    const wordPlace = $("#wordPlace");
    wordPlace.empty();

    [...word].forEach((letter, index) => {
        wordPlace.append(`
            <div class="letter p-2 mx-1">
                <p id="letter${index}" class="m-0" style="${letter === " " ? "visibility: visible;" : "visibility: hidden;"}">
                    ${letter === " " ? "&nbsp;" : letter.toUpperCase()}
                </p>
            </div>
        `);
    });
};

// Add Keyboard Listeners
const addKeyboardListeners = (word) => {
    $(".letterBtn").off("click").on("click", function () {
        const clickedLetter = $(this).text().toUpperCase().trim();
        const normalizedWord = word.toUpperCase();

        $(this).prop("disabled", true);

        if (normalizedWord.includes(clickedLetter)) {
            $(this)
                .addClass("text-bg-success")
                .css("background", "linear-gradient(135deg, #28a745, #218838)"); // Green gradient for correct letters
            revealMatchingLetters(word, clickedLetter);
        } else {
            $(this)
                .addClass("text-bg-warning")
                .css("background", "linear-gradient(135deg, #ffc107, #e0a800)"); // Yellow gradient for incorrect letters
            updateHangmanImage(word);
        }
    });
};


// Reveal Matching Letters
const revealMatchingLetters = (word, letter) => {
    [...word.toUpperCase()].forEach((char, index) => {
        if (char === letter) {
            $(`#letter${index}`).css("visibility", "visible");
        }
    });

    checkWordCompletion(word);
};

// Check Word Completion
const checkWordCompletion = (word) => {
    const allRevealed = [...word.toUpperCase()].every((char, index) => {
        if (char === " ") return true;
        return $(`#letter${index}`).css("visibility") === "visible";
    });

    if (allRevealed) {
        disableKeyboard();
        showToast("You Win!", true);
    }
};

// Disable Keyboard
const disableKeyboard = () => {
    $(".letterBtn").prop("disabled", true).addClass("disabled-key");
    document.removeEventListener("keydown", handleKeyDown);
};

// Show Toast
const showToast = (message, isWin) => {
    const toast = document.getElementById("toastMessage");
    const toastText = document.getElementById("toastText");

    toastText.textContent = message;
    toast.classList.remove("d-none", "text-bg-success", "text-bg-danger");
    toast.classList.add(isWin ? "text-bg-success" : "text-bg-danger");

    toast.style.display = "block";
    setTimeout(() => {
        toast.classList.add("d-none");
        toast.style.display = "none";
    }, 5000);
};

// Handle Physical Keyboard Input
const handleKeyDown = (event) => {
    const pressedKey = event.key.toUpperCase();
    if (/^[A-Z]$/.test(pressedKey)) {
        const button = $(`#letter${pressedKey}`);
        if (button.length && !button.prop("disabled")) {
            button.click();
        }
    }
};

// Initialize Dropdowns
const populateDropdowns = async () => {
    try {
        const response = await fetch("./tools/manyWords.json");
        if (!response.ok) throw new Error("Failed to load JSON");

        const data = await response.json();

        // Populate the Category Dropdown
        const categoryMenu = document.getElementById("categoryMenu");
        categoryMenu.innerHTML = "";
        Object.keys(data.categories).forEach((category) => {
            categoryMenu.innerHTML += `<li><a class="dropdown-item text-capitalize" href="#">${category}</a></li>`;
        });

        // Populate the Difficulty Dropdown
        const levelMenu = document.getElementById("levelMenu");
        levelMenu.innerHTML = "";
        ["easy", "medium", "hard"].forEach((level) => {
            levelMenu.innerHTML += `<li><a class="dropdown-item text-capitalize" href="#">${level}</a></li>`;
        });

        attachDropdownListeners(data);
    } catch (error) {
        console.error("Error loading dropdowns:", error);
    }
};

const fetchRandomWord = async () => {
    if (!selectedCategory || !selectedDifficulty) {
        console.error("Please select both a category and a difficulty before starting!");
        return null;
    }

    try {
        const response = await fetch("./tools/manyWords.json");
        if (!response.ok) throw new Error("Failed to load JSON");

        const data = await response.json();
        const words = data.categories[selectedCategory]?.[selectedDifficulty] || [];

        // Prevent selecting empty or invalid word sets
        if (words.length === 0) {
            console.error("No words available for the selected category and difficulty.");
            return null;
        }

        // Select a random word
        return words[Math.floor(Math.random() * words.length)];
    } catch (error) {
        console.error("Error fetching random word:", error);
        return null;
    }
};


// Attach Dropdown Listeners
const attachDropdownListeners = (data) => {
    const categoryButton = document.querySelector("#theme .btn");
    const difficultyButton = document.querySelector("#size .btn");

    document.querySelectorAll("#categoryMenu .dropdown-item").forEach((item) => {
        item.addEventListener("click", (event) => {
            categoryButton.textContent = event.target.textContent;
            selectedCategory = event.target.textContent;
        });
    });

    document.querySelectorAll("#levelMenu .dropdown-item").forEach((item) => {
        item.addEventListener("click", (event) => {
            difficultyButton.textContent = event.target.textContent;
            selectedDifficulty = event.target.textContent;
        });
    });
};

// Start Game
$("#startBtn").on("click", async () => {
    if (!selectedCategory || !selectedDifficulty) {
        console.error("Please select both a category and a difficulty before starting!");
        return;
    }

    resetGameElements();
    generateLetterKeys();
    document.addEventListener("keydown", handleKeyDown);

    try {
        const randomWord = await fetchRandomWord();
        if (!randomWord) {
            alert("No words available for the selected category and difficulty.");
            return;
        }

        console.log(`Selected Word: ${randomWord}`);
        await fetchWordDescription(randomWord);
        populateWordSpace(randomWord);
        addKeyboardListeners(randomWord);
    } catch (error) {
        console.error("Error starting the game:", error);
    }
});


// Initialize on Page Load
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("hangmanImage").style.opacity = 0.5;
    generateLetterKeys();
    populateDropdowns();
});
