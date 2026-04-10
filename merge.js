// Merge Sort logic integration with shared.js

/**
 * Main Sort Entry Point
 */
async function startMergeSort() {
    if (isSorting) return;
    
    const bubbles = document.getElementsByClassName("bubble");
    if (bubbles.length === 0) return;

    toggleControls(true);
    resetStats();

    await mergeSortRecursive(0, bubbles.length - 1);
    
    // Final sorted highlight
    for(let i=0; i<bubbles.length; i++) {
        bubbles[i].classList.add("sorted");
        await sleep();
    }

    toggleControls(false);
}

/**
 * Primary Merge Sort recursive function
 */
async function mergeSortRecursive(start, end) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);

    await mergeSortRecursive(start, mid);
    await mergeSortRecursive(mid + 1, end);
    await merge(start, mid, end);
}

/**
 * Merge function with visualization
 */
async function merge(start, mid, end) {
    const bubbles = document.getElementsByClassName("bubble");
    const temp = [];

    let i = start,
        j = mid + 1;

    // Highlight the range being merged
    for (let k = start; k <= end; k++) {
        bubbles[k].style.backgroundColor = "rgba(56, 189, 248, 0.2)"; // Light highlight
    }

    while (i <= mid && j <= end) {
        bubbles[i].classList.add("comparing");
        bubbles[j].classList.add("comparing");
        
        incrementComparisons();
        await sleep();

        if (parseInt(bubbles[i].dataset.value) <= parseInt(bubbles[j].dataset.value)) {
            temp.push({
                value: bubbles[i].dataset.value,
                text: bubbles[i].textContent,
                width: bubbles[i].style.width,
                height: bubbles[i].style.height
            });
            bubbles[i].classList.remove("comparing");
            i++;
        } else {
            temp.push({
                value: bubbles[j].dataset.value,
                text: bubbles[j].textContent,
                width: bubbles[j].style.width,
                height: bubbles[j].style.height
            });
            bubbles[j].classList.remove("comparing");
            j++;
        }
    }

    while (i <= mid) {
        temp.push({
            value: bubbles[i].dataset.value,
            text: bubbles[i].textContent,
            width: bubbles[i].style.width,
            height: bubbles[i].style.height
        });
        i++;
    }

    while (j <= end) {
        temp.push({
            value: bubbles[j].dataset.value,
            text: bubbles[j].textContent,
            width: bubbles[j].style.width,
            height: bubbles[j].style.height
        });
        j++;
    }

    // Copy back to DOM and visualize the merge
    for (let k = start; k <= end; k++) {
        const item = temp[k - start];
        bubbles[k].dataset.value = item.value;
        bubbles[k].textContent = item.text;
        bubbles[k].style.width = item.width;
        bubbles[k].style.height = item.height;
        
        bubbles[k].classList.add("merged");
        bubbles[k].style.backgroundColor = ""; // Reset background
        await sleep();
        bubbles[k].classList.remove("merged");
    }
}

// Attach to global sort button
if (sortBtn) sortBtn.onclick = startMergeSort;

