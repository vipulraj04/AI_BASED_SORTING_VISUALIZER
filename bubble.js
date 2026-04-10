// Bubble Sort logic integration with shared.js

/**
 * Bubble Sort visualization
 */
async function bubbleSort() {
    if (isSorting) return;
    
    const bubbles = document.getElementsByClassName("bubble");
    if (bubbles.length === 0) return;

    toggleControls(true);
    resetStats();

    for (let i = 0; i < bubbles.length - 1; i++) {
        for (let j = 0; j < bubbles.length - i - 1; j++) {
            
            // Highlight the elements being compared
            bubbles[j].classList.add("comparing");
            bubbles[j + 1].classList.add("comparing");
            
            incrementComparisons();
            await sleep();

            const val1 = parseInt(bubbles[j].dataset.value);
            const val2 = parseInt(bubbles[j + 1].dataset.value);

            if (val1 > val2) {
                // Highlight the elements being swapped
                bubbles[j].classList.add("swapping");
                bubbles[j + 1].classList.add("swapping");
                
                incrementSwaps();
                
                // Swap values and text
                const tempValue = bubbles[j].dataset.value;
                const tempText = bubbles[j].textContent;
                const tempWidth = bubbles[j].style.width;
                const tempHeight = bubbles[j].style.height;

                bubbles[j].dataset.value = bubbles[j + 1].dataset.value;
                bubbles[j].textContent = bubbles[j + 1].textContent;
                bubbles[j].style.width = bubbles[j + 1].style.width;
                bubbles[j].style.height = bubbles[j + 1].style.height;

                bubbles[j + 1].dataset.value = tempValue;
                bubbles[j + 1].textContent = tempText;
                bubbles[j + 1].style.width = tempWidth;
                bubbles[j + 1].style.height = tempHeight;

                await sleep();
                
                bubbles[j].classList.remove("swapping");
                bubbles[j + 1].classList.remove("swapping");
            }

            bubbles[j].classList.remove("comparing");
            bubbles[j + 1].classList.remove("comparing");
        }
        // Mark the last element as sorted
        bubbles[bubbles.length - i - 1].classList.add("sorted");
    }
    
    // Mark the first element as sorted at the end
    if (bubbles.length > 0) bubbles[0].classList.add("sorted");
    
    toggleControls(false);
}

// Attach to global sort button
if (sortBtn) sortBtn.onclick = bubbleSort;

