/**
 * shared.js - Shared functionality for all sorting algorithms
 */

let isSorting = false;
let comparisons = 0;
let swaps = 0;

const delaySlider = document.getElementById("speed-slider");
const arraySizeSlider = document.getElementById("size-slider");
const comparisonsDisplay = document.getElementById("comparisons-count");
const swapsDisplay = document.getElementById("swaps-count");
const generateArrayBtn = document.getElementById("generate-array");
const randomizeBtn = document.getElementById("randomize-array");
const sortBtn = document.getElementById("sort-button");
const arrayInput = document.getElementById("array-input");
const container = document.getElementById("array-container");

/**
 * Delay function that reads the current speed from the slider
 */
async function sleep() {
    const speed = delaySlider ? 1001 - delaySlider.value : 500;
    return new Promise(resolve => setTimeout(resolve, speed));
}

/**
 * Updates the statistics displays
 */
function updateStatsUI() {
    if (comparisonsDisplay) comparisonsDisplay.textContent = comparisons;
    if (swapsDisplay) swapsDisplay.textContent = swaps;
}

/**
 * Resets stats
 */
function resetStats() {
    comparisons = 0;
    swaps = 0;
    updateStatsUI();
}

/**
 * Increment functions
 */
function incrementComparisons() {
    comparisons++;
    updateStatsUI();
}

function incrementSwaps() {
    swaps++;
    updateStatsUI();
}

/**
 * Toggles control availability
 */
function toggleControls(disabled) {
    isSorting = disabled;
    const elements = [generateArrayBtn, randomizeBtn, sortBtn, arraySizeSlider];
    elements.forEach(el => {
        if (el) el.disabled = disabled;
    });
    if (arrayInput) arrayInput.disabled = disabled;
}

/**
 * Generates an array based on manual input
 */
function generateArrayFromInput() {
    if (isSorting) return;
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

    renderArray(numbers);
    resetStats();
}

/**
 * Generates a random array
 */
function generateRandomArray() {
    if (isSorting) return;
    const size = arraySizeSlider ? parseInt(arraySizeSlider.value) : 10;
    const numbers = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
    renderArray(numbers);
    resetStats();
}

/**
 * Renders the array as bubbles
 */
function renderArray(numbers) {
    container.innerHTML = "";
    numbers.forEach(value => {
        const bubble = document.createElement("div");
        bubble.classList.add("bubble");
        bubble.textContent = value;
        bubble.setAttribute("data-value", value);
        
        // Add a bit of size variation based on value for better visual feedback
        // while keeping it a circle
        const size = Math.max(40, Math.min(70, 40 + (value / 100) * 30));
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        container.appendChild(bubble);
    });
}

// Event Listeners
if (generateArrayBtn) generateArrayBtn.addEventListener("click", generateArrayFromInput);
if (randomizeBtn) randomizeBtn.addEventListener("click", generateRandomArray);
if (arraySizeSlider) arraySizeSlider.addEventListener("input", generateRandomArray);

// Initialize with a random array
document.addEventListener("DOMContentLoaded", () => {
    generateRandomArray();
});
