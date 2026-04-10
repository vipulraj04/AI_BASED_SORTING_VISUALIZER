// Selection Sort logic integration with shared.js

/**
 * Main Sort Entry Point
 */
async function startSelectionSort() {
    if (isSorting) return;
    
    const bubbles = document.getElementsByClassName("bubble");
    if (bubbles.length === 0) return;

    toggleControls(true);
    resetStats();

    for (let i = 0; i < bubbles.length - 1; i++) {
        let minIdx = i;
        
        // Highlight the current position we are filling
        bubbles[i].style.backgroundColor = "rgba(139, 92, 246, 0.5)"; // Purple tint for target

        for (let j = i + 1; j < bubbles.length; j++) {
            bubbles[j].classList.add("comparing");
            incrementComparisons();
            await sleep();

            if (parseInt(bubbles[j].dataset.value) < parseInt(bubbles[minIdx].dataset.value)) {
                // Remove previous min highlight
                if (minIdx !== i) bubbles[minIdx].style.backgroundColor = "";
                
                minIdx = j;
                // Highlight new min
                bubbles[minIdx].style.backgroundColor = "#ef4444"; // Red for current min
            }
            
            bubbles[j].classList.remove("comparing");
        }

        if (minIdx !== i) {
            incrementSwaps();
            await swapBubbles(i, minIdx);
        }
        
        // Reset colors and mark as sorted
        bubbles[i].style.backgroundColor = "";
        bubbles[minIdx].style.backgroundColor = "";
        bubbles[i].classList.add("sorted");
    }
    
    // Mark the last element as sorted
    if (bubbles.length > 0) bubbles[bubbles.length - 1].classList.add("sorted");

    toggleControls(false);
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
if (sortBtn) sortBtn.onclick = startSelectionSort;

