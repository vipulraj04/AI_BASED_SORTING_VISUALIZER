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

// Quick Sort logic integration with shared.js

/**
 * Main Sort Entry Point
 */
async function startQuickSort() {
    if (isSorting) return;
    
    const bubbles = document.getElementsByClassName("bubble");
    if (bubbles.length === 0) return;

    toggleControls(true);
    resetStats();

    await quickSortRecursive(0, bubbles.length - 1);
    
    // Final sorted highlight
    for(let i=0; i<bubbles.length; i++) {
        bubbles[i].classList.add("sorted");
        await sleep();
    }

    toggleControls(false);
}

/**
 * Primary Quick Sort recursive function
 */
async function quickSortRecursive(low, high) {
    if (low < high) {
        const pivotIndex = await partition(low, high);
        await quickSortRecursive(low, pivotIndex - 1);
        await quickSortRecursive(pivotIndex + 1, high);
    }
}

/**
 * Partition function with visualization
 */
async function partition(low, high) {
    const bubbles = document.getElementsByClassName("bubble");
    const pivotValue = parseInt(bubbles[high].dataset.value);
    
    // Highlight pivot
    bubbles[high].style.backgroundColor = "#8b5cf6"; // Purple for pivot
    bubbles[high].classList.add("swapping");

    let i = low - 1;

    for (let j = low; j < high; j++) {
        bubbles[j].classList.add("comparing");
        incrementComparisons();
        await sleep();

        if (parseInt(bubbles[j].dataset.value) < pivotValue) {
            i++;
            incrementSwaps();
            await swapBubbles(i, j);
        }
        bubbles[j].classList.remove("comparing");
    }

    incrementSwaps();
    await swapBubbles(i + 1, high);
    
    // Reset pivot color
    bubbles[high].style.backgroundColor = "";
    bubbles[high].classList.remove("swapping");
    bubbles[i+1].classList.add("sorted");

    return i + 1;
}

/**
 * Helper to swap two bubbles in the DOM
 */
async function swapBubbles(idx1, idx2) {
    const bubbles = document.getElementsByClassName("bubble");
    
    bubbles[idx1].classList.add("swapping");
    bubbles[idx2].classList.add("swapping");
    await sleep();

    const tempValue = bubbles[idx1].dataset.value;
    const tempText = bubbles[idx1].textContent;
    const tempWidth = bubbles[idx1].style.width;
    const tempHeight = bubbles[idx1].style.height;

    bubbles[idx1].dataset.value = bubbles[idx2].dataset.value;
    bubbles[idx1].textContent = bubbles[idx2].textContent;
    bubbles[idx1].style.width = bubbles[idx2].style.width;
    bubbles[idx1].style.height = bubbles[idx2].style.height;

    bubbles[idx2].dataset.value = tempValue;
    bubbles[idx2].textContent = tempText;
    bubbles[idx2].style.width = tempWidth;
    bubbles[idx2].style.height = tempHeight;

    await sleep();
    
    bubbles[idx1].classList.remove("swapping");
    bubbles[idx2].classList.remove("swapping");
}

// Attach to global sort button
if (sortButton) sortButton.onclick = startQuickSort;

// Event listeners
    alert("Array is sorted!");
});
