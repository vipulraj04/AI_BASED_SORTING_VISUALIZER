// Swap function
function swap(el1, el2) {
    let temp = el1.style.height;
    el1.style.height = el2.style.height;
    el2.style.height = temp;
}

// Delay function for animations
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Bubble Sort
async function bubbleSort() {
    let bars = document.querySelectorAll(".bar");
    for (let i = 0; i < bars.length - 1; i++) {
        for (let j = 0; j < bars.length - i - 1; j++) {
            bars[j].classList.add("swapping");
            bars[j + 1].classList.add("swapping");
            await wait(100);
            if (parseInt(bars[j].style.height) > parseInt(bars[j + 1].style.height)) {
                swap(bars[j], bars[j + 1]);
            }
            bars[j].classList.remove("swapping");
            bars[j + 1].classList.remove("swapping");
        }
        bars[bars.length - i - 1].classList.add("sorted");
    }
}

// Insertion Sort
async function insertionSort() {
    let bars = document.querySelectorAll(".bar");
    for (let i = 1; i < bars.length; i++) {
        let key = bars[i].style.height;
        let j = i - 1;
        while (j >= 0 && parseInt(bars[j].style.height) > parseInt(key)) {
            bars[j + 1].style.height = bars[j].style.height;
            j--;
            await wait(100);
        }
        bars[j + 1].style.height = key;
    }
}

// Selection Sort
async function selectionSort() {
    let bars = document.querySelectorAll(".bar");
    for (let i = 0; i < bars.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < bars.length; j++) {
            if (parseInt(bars[j].style.height) < parseInt(bars[minIndex].style.height)) {
                minIndex = j;
            }
        }
        swap(bars[i], bars[minIndex]);
        bars[i].classList.add("sorted");
        await wait(100);
    }
}

// Quick Sort
async function quickSort(left = 0, right = document.querySelectorAll(".bar").length - 1) {
    let bars = document.querySelectorAll(".bar");
    if (left < right) {
        let pivotIndex = await partition(bars, left, right);
        await quickSort(left, pivotIndex - 1);
        await quickSort(pivotIndex + 1, right);
    }
}

async function partition(bars, left, right) {
    let pivot = parseInt(bars[right].style.height);
    let i = left - 1;
    for (let j = left; j < right; j++) {
        if (parseInt(bars[j].style.height) < pivot) {
            i++;
            swap(bars[i], bars[j]);
            await wait(100);
        }
    }
    swap(bars[i + 1], bars[right]);
    return i + 1;
}

// Merge Sort
async function mergeSort(arr, left, right) {
    if (left >= right) return;
    let mid = Math.floor((left + right) / 2);
    await mergeSort(arr, left, mid);
    await mergeSort(arr, mid + 1, right);
    await merge(arr, left, mid, right);
}

async function merge(arr, left, mid, right) {
    let bars = document.querySelectorAll(".bar");
    let leftArr = [], rightArr = [];
    for (let i = left; i <= mid; i++) leftArr.push(bars[i].style.height);
    for (let i = mid + 1; i <= right; i++) rightArr.push(bars[i].style.height);
    
    let i = 0, j = 0, k = left;
    while (i < leftArr.length && j < rightArr.length) {
        if (parseInt(leftArr[i]) < parseInt(rightArr[j])) {
            bars[k++].style.height = leftArr[i++];
        } else {
            bars[k++].style.height = rightArr[j++];
        }
        await wait(100);
    }
    while (i < leftArr.length) bars[k++].style.height = leftArr[i++];
    while (j < rightArr.length) bars[k++].style.height = rightArr[j++];
}

// Radix Sort
async function radixSort() {
    let bars = document.querySelectorAll(".bar");
    let maxNum = Math.max(...Array.from(bars, bar => parseInt(bar.style.height)));
    let exp = 1;
    while (maxNum / exp > 1) {
        await countingSort(bars, exp);
        exp *= 10;
    }
}

async function countingSort(bars, exp) {
    let output = new Array(bars.length).fill(0);
    let count = new Array(10).fill(0);

    for (let i = 0; i < bars.length; i++) {
        let index = Math.floor(parseInt(bars[i].style.height) / exp) % 10;
        count[index]++;
    }
    
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];

    for (let i = bars.length - 1; i >= 0; i--) {
        let index = Math.floor(parseInt(bars[i].style.height) / exp) % 10;
        output[count[index] - 1] = bars[i].style.height;
        count[index]--;
    }

    for (let i = 0; i < bars.length; i++) {
        bars[i].style.height = output[i];
        await wait(100);
    }
}

// Bucket Sort
async function bucketSort() {
    let bars = document.querySelectorAll(".bar");
    let bucketCount = Math.ceil(Math.sqrt(bars.length));
    let buckets = Array.from({ length: bucketCount }, () => []);

    // Distribute elements into buckets
    let maxVal = Math.max(...Array.from(bars, bar => parseInt(bar.style.height)));
    for (let bar of bars) {
        let value = parseInt(bar.style.height);
        let index = Math.floor((value / maxVal) * (bucketCount - 1));
        buckets[index].push(value);
    }

    // Sort individual buckets
    for (let bucket of buckets) {
        bucket.sort((a, b) => a - b);
    }

    // Reassemble sorted values
    let index = 0;
    for (let bucket of buckets) {
        for (let value of bucket) {
            bars[index].style.height = `${value}px`;
            await wait(100);
            index++;
        }
    }
}
function generateNewArray(size = 20) {
    const arrayContainer = document.getElementById("array-container");
    arrayContainer.innerHTML = ""; // Clear previous bars

    let newArray = [];
    for (let i = 0; i < size; i++) {
        newArray.push(Math.floor(Math.random() * 100) + 5);
    }

    // Display the bars
    newArray.forEach(value => {
        const bar = document.createElement("div");
        bar.classList.add("array-bar");
        bar.style.height = `${value * 3}px`; // Scale height
        arrayContainer.appendChild(bar);
    });

    console.log("New array generated:", newArray);
}


// Export functions
export { bubbleSort, insertionSort, selectionSort, quickSort, mergeSort, radixSort, bucketSort ,generateNewArray};
