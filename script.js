const container = document.getElementById("array-container");
const generateArrayButton = document.getElementById("generate-array");
const bubbleSortButton = document.getElementById("bubble-sort");
const insertionSortButton = document.getElementById("insertion-sort");
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

// Bubble Sort visualization
async function bubbleSort() {
    const bubbles = document.getElementsByClassName("bubble");
    for (let i = 0; i < bubbles.length - 1; i++) {
        for (let j = 0; j < bubbles.length - i - 1; j++) {
            bubbles[j].classList.add("red");
            bubbles[j + 1].classList.add("red");
            await new Promise(resolve => setTimeout(resolve, 500)); // Delay
            if (parseInt(bubbles[j].dataset.value) > parseInt(bubbles[j + 1].dataset.value)) {
                // Swap values
                const tempValue = bubbles[j].dataset.value;
                bubbles[j].dataset.value = bubbles[j + 1].dataset.value;
                bubbles[j].textContent = bubbles[j + 1].dataset.value;

                bubbles[j + 1].dataset.value = tempValue;
                bubbles[j + 1].textContent = tempValue;
            }
            bubbles[j].classList.remove("red");
            bubbles[j + 1].classList.remove("red");
        }
    }
}

// Insertion Sort visualization
async function insertionSort() {
    const bubbles = document.getElementsByClassName("bubble");
    for (let i = 1; i < bubbles.length; i++) {
        let j = i - 1;
        const currentValue = bubbles[i].dataset.value;

        bubbles[i].classList.add("red");
        await new Promise(resolve => setTimeout(resolve, 500)); // Delay
        while (j >= 0 && parseInt(bubbles[j].dataset.value) > parseInt(currentValue)) {
            bubbles[j + 1].dataset.value = bubbles[j].dataset.value;
            bubbles[j + 1].textContent = bubbles[j].textContent;

            bubbles[j].classList.add("red");
            j--;
            await new Promise(resolve => setTimeout(resolve, 500)); // Delay
        }
        bubbles[j + 1].dataset.value = currentValue;
        bubbles[j + 1].textContent = currentValue;
        bubbles[i].classList.remove("red");
    }
}

// Event listeners
generateArrayButton.addEventListener("click", generateArrayFromInput);
bubbleSortButton.addEventListener("click", bubbleSort);
insertionSortButton.addEventListener("click", insertionSort);
