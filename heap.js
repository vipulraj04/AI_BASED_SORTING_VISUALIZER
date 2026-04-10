// Heap Sort logic integration with shared.js

/**
 * Heap Sort visualization
 */
async function heapSort() {
    if (isSorting) return;
    
    const bubbles = document.getElementsByClassName("bubble");
    const n = bubbles.length;
    if (n === 0) return;

    toggleControls(true);
    resetStats();

    // 1. Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(bubbles, n, i);
    }

    // 2. Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
        bubbles[0].classList.add("swapping");
        bubbles[i].classList.add("swapping");
        
        await swapBubbles(bubbles[0], bubbles[i]);
        incrementSwaps();
        await sleep();

        bubbles[0].classList.remove("swapping");
        bubbles[i].classList.remove("swapping");
        
        // Mark the element moved to the end as sorted
        bubbles[i].classList.add("sorted");

        // call max heapify on the reduced heap
        await heapify(bubbles, i, 0);
    }
    
    // Mark the last element (index 0) as sorted
    bubbles[0].classList.add("sorted");
    
    toggleControls(false);
}

/**
 * To heapify a subtree rooted with node i which is an index in bubbles[]. 
 * n is size of heap
 */
async function heapify(bubbles, n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    // Highlight the root being heapified
    bubbles[i].classList.add("comparing");
    await sleep();

    // Compare with left child
    if (left < n) {
        bubbles[left].classList.add("comparing");
        incrementComparisons();
        await sleep();
        
        if (parseInt(bubbles[left].dataset.value) > parseInt(bubbles[largest].dataset.value)) {
            largest = left;
        }
        bubbles[left].classList.remove("comparing");
    }

    // Compare with right child
    if (right < n) {
        bubbles[right].classList.add("comparing");
        incrementComparisons();
        await sleep();
        
        if (parseInt(bubbles[right].dataset.value) > parseInt(bubbles[largest].dataset.value)) {
            largest = right;
        }
        bubbles[right].classList.remove("comparing");
    }

    // If largest is not root
    if (largest !== i) {
        // Highlight swap
        bubbles[i].classList.add("swapping");
        bubbles[largest].classList.add("swapping");
        
        await swapBubbles(bubbles[i], bubbles[largest]);
        incrementSwaps();
        await sleep();
        
        bubbles[i].classList.remove("swapping");
        bubbles[largest].classList.remove("swapping");

        // Recursively heapify the affected sub-tree
        bubbles[i].classList.remove("comparing");
        await heapify(bubbles, n, largest);
    } else {
        bubbles[i].classList.remove("comparing");
    }
}

/**
 * Utility to swap two bubble elements' contents and datasets
 */
async function swapBubbles(bubble1, bubble2) {
    const tempValue = bubble1.dataset.value;
    const tempText = bubble1.textContent;
    const tempWidth = bubble1.style.width;
    const tempHeight = bubble1.style.height;

    bubble1.dataset.value = bubble2.dataset.value;
    bubble1.textContent = bubble2.textContent;
    bubble1.style.width = bubble2.style.width;
    bubble1.style.height = bubble2.style.height;

    bubble2.dataset.value = tempValue;
    bubble2.textContent = tempText;
    bubble2.style.width = tempWidth;
    bubble2.style.height = tempHeight;
}

// Attach to global sort button
if (sortBtn) sortBtn.onclick = heapSort;
