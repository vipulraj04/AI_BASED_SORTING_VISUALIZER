const container = document.getElementById("array-container");
const generateArrayButton = document.getElementById("generate-array");
const sortButton = document.getElementById("sort-button");
const arrayInput = document.getElementById("array-input");

// Generate array based on user input
function generateArrayFromInput() {
    const input = arrayInput.value.trim();
    if (!input) {
        alert("Please enter numbers separated by commas.");
        return;
    }

    const numbers = input.split(",").map(num => parseInt(num.trim()));
    if (numbers.some(isNaN)) {
        alert("Invalid input. Ensure all values are numbers separated by commas.");
        return;
    }

    container.innerHTML = ""; // Clear the container
    numbers.forEach(value => {
        const bubble = document.createElement("div");
        bubble.classList.add("bubble");
        bubble.textContent = value; // Display number inside the bubble
        bubble.setAttribute("data-value", value); // Store the original value
        container.appendChild(bubble);
    });
}

// Insertion Sort logic integration with shared.js

/**
 * Main Sort Entry Point
 */
async function startInsertionSort() {
    if (isSorting) return;
    
    const bubbles = document.getElementsByClassName("bubble");
    if (bubbles.length === 0) return;

    toggleControls(true);
    resetStats();

    // The first element is already "sorted" relative to itself
    bubbles[0].classList.add("sorted");

    for (let i = 1; i < bubbles.length; i++) {
        let keyVal = parseInt(bubbles[i].dataset.value);
        let j = i - 1;

        bubbles[i].classList.add("comparing");
        await sleep();

        while (j >= 0 && parseInt(bubbles[j].dataset.value) > keyVal) {
            bubbles[j].classList.add("comparing");
            incrementComparisons();
            await sleep();

            // Shift element right
            incrementSwaps(); // Counting shifts as swaps for stats consistency
            await swapBubbles(j, j + 1);
            
            bubbles[j+1].classList.remove("comparing");
            j = j - 1;
        }
        bubbles[j + 1].dataset.value = currentValue;
        bubbles[j + 1].textContent = currentValue;

        bubbles[i].classList.remove("red");
        bubbles[j + 1].classList.add("teal"); // Mark sorted bubbles
    }
}

// Event listeners
generateArrayButton.addEventListener("click", generateArrayFromInput);
sortButton.addEventListener("click", insertionSort);
