document.addEventListener("DOMContentLoaded", () => {
    function loadSortContent() {
        fetch('/sorts/Sort.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('sort-content-placeholder').innerHTML = html;
            })
            .catch(error => console.error('Error loading Sort.html:', error));
    }

    loadSortContent();

    const barsContainer = document.getElementById("bars-container");
    const randomizeButton = document.getElementById("randomize");
    const startButton = document.getElementById("start");
    const pauseButton = document.getElementById("pause");
    const stopButton = document.getElementById("stop");
    const arraySizeInput = document.getElementById("array-size");
    const speedSelect = document.getElementById("speed");
    const inputDataField = document.getElementById("input-data");
    const submitButton = document.getElementById("submit");
    const submittedDataDiv = document.getElementById("submitted-data");
    const sortingAlgorithm = document.getElementById("algorithm");
    

    let bars = [];
    let originalHeights = [];
    let delay = 100;
    const containerHeight = barsContainer.clientHeight;   

    function setSpeed() {
        const speed = speedSelect.value;
        delay = speed === "Slow" ? 650 : speed === "Moderate" ? 100 : 30;
    }

    function generateBars(num = 20) {
        barsContainer.innerHTML = "";
        bars = [];
        originalHeights = [];
        const barWidth = Math.floor((barsContainer.clientWidth / num) - 5);
        
        for (let i = 0; i < num; i++) {
            const barHeight = Math.floor(Math.random() * 200) + 10;

            const barWrapper = document.createElement("div");
            barWrapper.classList.add("bar-wrapper");
            barWrapper.style.width = `${barWidth}px`;

            const bar = document.createElement("div");
            bar.classList.add("bar");
            bar.style.height = `${(barHeight / 200) * containerHeight * 0.6}px`;
            bar.style.width = `${barWidth}px`;
            bar.style.backgroundColor = "#6E605F";
            bar.textContent = barHeight;
            bars.push(bar);
            originalHeights.push(barHeight);

            const indexLabel = document.createElement("div");
            indexLabel.classList.add("index-label");
            indexLabel.textContent = i;

            barWrapper.appendChild(bar);
            barWrapper.appendChild(indexLabel);
            barsContainer.appendChild(barWrapper);
        }
    }

    function generateBarsFromInput(input) {
        const heights = input.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
        barsContainer.innerHTML = "";
        bars = [];
        originalHeights = heights;
        const barWidth = Math.floor((barsContainer.clientWidth / heights.length) - 5);
    
        if (heights.length === 0) return;

        const maxHeight = Math.max(...heights);
        const scalingFactor = containerHeight * 0.6 / maxHeight;

        heights.forEach((height, index) => {
            const barWrapper = document.createElement("div");
            barWrapper.classList.add("bar-wrapper");
            barWrapper.style.width = `${barWidth}px`;

            const bar = document.createElement("div");
            bar.classList.add("bar");
            bar.style.height = `${height * scalingFactor}px`;
            bar.style.width = `${barWidth}px`;
            bar.style.backgroundColor = "#6E605F"; 
            bar.textContent = height;
            bars.push(bar);

            const indexLabel = document.createElement("div");
            indexLabel.classList.add("index-label");
            indexLabel.textContent = index;

            barWrapper.appendChild(bar);
            barWrapper.appendChild(indexLabel);
            barsContainer.appendChild(barWrapper);
        });
    }

    let isPaused = false;
    let isStopped = false;
    let isSortInProgress = false;

    startButton.addEventListener("click", () => {
        if (isSortInProgress = true) {
            startButton.disabled = true;
        }
        if (isStopped) {
            isStopped = false;
        }
    });

    pauseButton.addEventListener("click", () => {
        isPaused = !isPaused;
        startButton.disabled = true;
    });

    stopButton.addEventListener("click", () => {
        isStopped = true;
        isPaused = false;
        startButton.disabled = false;
    });

    async function bubbleSort(order) {
        setSpeed();
        const maxOriginalHeight = Math.max(...originalHeights);
        const heightScalingFactor = containerHeight * 0.6 / maxOriginalHeight;
        isSortInProgress = true;
    
        for (let i = 0; i < bars.length - 1; i++) {
            for (let j = 0; j < bars.length - i - 1; j++) {
                
                if (isStopped) {
                    return;
                }

                bars[j].style.backgroundColor = "red"; 
                bars[j + 1].style.backgroundColor = "red"; 

                await new Promise(resolve => setTimeout(resolve, delay)); 

                while (isPaused) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                const height1 = originalHeights[j];
                const height2 = originalHeights[j + 1];

                if (order === "ascending" && height1 > height2) {
                    
                    [originalHeights[j], originalHeights[j + 1]] = [originalHeights[j + 1], originalHeights[j]];

                    
                    bars[j].style.height = `${height2 * heightScalingFactor}px`;
                    bars[j].textContent = height2;
                    bars[j + 1].style.height = `${height1 * heightScalingFactor}px`;
                    bars[j + 1].textContent = height1;
                }
                if (order === "descending" && height1 < height2) {
                
                    [originalHeights[j], originalHeights[j + 1]] = [originalHeights[j + 1], originalHeights[j]];
    
                    bars[j].style.height = `${height2 * heightScalingFactor}px`;
                    bars[j].textContent = height2;
                    bars[j + 1].style.height = `${height1 * heightScalingFactor}px`;
                    bars[j + 1].textContent = height1;
                }

                if (!isPaused){
                    bars[j].style.backgroundColor = ""; 
                    bars[j + 1].style.backgroundColor = ""; 
                }
                
            }
           
            bars[bars.length - i - 1].style.backgroundColor = "#6E605F"; 
        }

        startButton.disabled = false; 
        isSortingInProgress = false;
    }

    async function selectionSort(order) {
        setSpeed();
        const maxOriginalHeight = Math.max(...originalHeights);
        const heightScalingFactor = containerHeight * 0.6 / maxOriginalHeight;
        isSortInProgress = true;

        for (let i = 0; i < bars.length - 1; i++) {
            let minOrMaxIndex = i;
    
            bars[i].style.backgroundColor = "red";
    
            for (let j = i + 1; j < bars.length; j++) {
                bars[j].style.backgroundColor = "orange";
                
                if (isStopped) {
                    bars[i].style.backgroundColor = "";
                    bars[j].style.backgroundColor = "";
                    return;
                }

                await new Promise(resolve => setTimeout(resolve, delay));

                while (isPaused) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                
                const height1 = originalHeights[minOrMaxIndex];
                const height2 = originalHeights[j];
    
                if ((order === "ascending" && height2 < height1) || (order === "descending" && height2 > height1)) {
                    if (minOrMaxIndex !== i) bars[minOrMaxIndex].style.backgroundColor = "";
                    minOrMaxIndex = j;
                    bars[minOrMaxIndex].style.backgroundColor = "blue"; 
                }
                
                bars[j].style.backgroundColor = "";
            }
    
            if (minOrMaxIndex !== i) {

                [originalHeights[i], originalHeights[minOrMaxIndex]] = [originalHeights[minOrMaxIndex], originalHeights[i]];
    
                bars[i].style.height = `${originalHeights[i] * heightScalingFactor}px`;
                bars[i].textContent = originalHeights[i];
                bars[minOrMaxIndex].style.height = `${originalHeights[minOrMaxIndex] * heightScalingFactor}px`;
                bars[minOrMaxIndex].textContent = originalHeights[minOrMaxIndex];
            }
            
            bars[i].style.backgroundColor = "#6E605F";
        }
    
        bars[bars.length - 1].style.backgroundColor = "#6E605F";

        startButton.disabled = false; 
        isSortingInProgress = false;
    }

    async function insertionSort(order) {
        setSpeed();
        const maxOriginalHeight = Math.max(...originalHeights);
        const heightScalingFactor = containerHeight * 0.6 / maxOriginalHeight;
        isSortInProgress = true;
    
        for (let i = 1; i < bars.length; i++) {
            let j = i;
            const heightToInsert = originalHeights[i];
    
            bars[i].style.backgroundColor = "red";
 
            while (j > 0 && 
                   ((order === "ascending" && originalHeights[j - 1] > heightToInsert) ||
                    (order === "descending" && originalHeights[j - 1] < heightToInsert))) {
                
                bars[j - 1].style.backgroundColor = "orange";

                if (isStopped) {
                    bars[i].style.backgroundColor = "";
                    bars[j - 1].style.backgroundColor = "";
                    return;
                }

                await new Promise(resolve => setTimeout(resolve, delay));

                while (isPaused) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
    
                originalHeights[j] = originalHeights[j - 1];
                bars[j].style.height = `${originalHeights[j] * heightScalingFactor}px`;
                bars[j].textContent = originalHeights[j];
    
                bars[j - 1].style.backgroundColor = "";
                j--;
            }
    
            originalHeights[j] = heightToInsert;
            bars[j].style.height = `${heightToInsert * heightScalingFactor}px`;
            bars[j].textContent = heightToInsert;
    
            bars[i].style.backgroundColor = ""; 
        }
    
        for (let k = 0; k < bars.length; k++) {
            bars[k].style.backgroundColor = "#6E605F";
        }

        startButton.disabled = false; 
        isSortingInProgress = false; 
    }
       
    async function mergeSort(order) {
        setSpeed();
        const maxOriginalHeight = Math.max(...originalHeights);
        const heightScalingFactor = containerHeight * 0.6 / maxOriginalHeight;
        isSortInProgress = true;
    
        async function merge(arr, left, mid, right) {
            let leftArray = arr.slice(left, mid + 1);
            let rightArray = arr.slice(mid + 1, right + 1);
            let i = 0, j = 0, k = left;
    
            while (i < leftArray.length && j < rightArray.length) {

                if (isStopped) {
                    bars[left + i].style.backgroundColor = "";
                    bars[mid + 1 + j].style.backgroundColor = "";
                    return; 
                }
    
                bars[left + i].style.backgroundColor = "red"; 
                bars[mid + 1 + j].style.backgroundColor = "red"; 
    
                await new Promise(resolve => setTimeout(resolve, delay)); 
    
                while (isPaused) {
                    await new Promise(resolve => setTimeout(resolve, 100)); 
                }
    
                if ((order === "ascending" && leftArray[i] <= rightArray[j]) || (order === "descending" && leftArray[i] >= rightArray[j])) {
                    arr[k] = leftArray[i];
                    i++;
                } else {
                    arr[k] = rightArray[j];
                    j++;
                }
    
                bars[k].style.height = `${arr[k] * heightScalingFactor}px`;
                bars[k].textContent = arr[k];
    
                k++;
            }
    
            while (i < leftArray.length) {
                arr[k] = leftArray[i];
                bars[k].style.height = `${arr[k] * heightScalingFactor}px`;
                bars[k].textContent = arr[k];
                i++;
                k++;
            }
    
            while (j < rightArray.length) {
                arr[k] = rightArray[j];
                bars[k].style.height = `${arr[k] * heightScalingFactor}px`;
                bars[k].textContent = arr[k];
                j++;
                k++;
            }

            for (let index = left; index <= right; index++) {
                bars[index].style.backgroundColor = "#6E605F"; 
            }
        }
    
        async function iterativeMergeSort(arr) {
            let size;
            let leftStart;
    
            for (size = 1; size < arr.length; size = 2 * size) {
          
                for (leftStart = 0; leftStart < arr.length - 1; leftStart += 2 * size) {
           
                    const mid = Math.min(leftStart + size - 1, arr.length - 1);
                    const rightEnd = Math.min(leftStart + 2 * size - 1, arr.length - 1);
    
                    await merge(arr, leftStart, mid, rightEnd);
                }
            }
        }
    
        await iterativeMergeSort(originalHeights);
    
        startButton.disabled = false; 
        isSortingInProgress = false; 
    }
    
    async function quickSort(order) {
        setSpeed();
        const maxOriginalHeight = Math.max(...originalHeights);
        const heightScalingFactor = containerHeight * 0.6 / maxOriginalHeight;
        isSortInProgress = true;
    
        function swap(arr, i, j) {
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    
        async function partition(arr, low, high) {
            const pivot = arr[high];
            let i = low - 1;
    
            for (let j = low; j < high; j++) {
               
                if (isStopped) {
                    return;  
                }
    
                bars[j].style.backgroundColor = "orange"; 
                bars[high].style.backgroundColor = "red"; 
    
                await new Promise(resolve => setTimeout(resolve, delay));
    
                while (isPaused) {
                    await new Promise(resolve => setTimeout(resolve, 100)); 
                }
    
                if ((order === "ascending" && arr[j] <= pivot) || (order === "descending" && arr[j] >= pivot)) {
                    i++;
                    swap(arr, i, j);
                   
                    bars[i].style.height = `${arr[i] * heightScalingFactor}px`;
                    bars[i].textContent = arr[i];
                    bars[j].style.height = `${arr[j] * heightScalingFactor}px`;
                    bars[j].textContent = arr[j];
                }
    
                bars[j].style.backgroundColor = "";
                bars[high].style.backgroundColor = "";
            }
    
            swap(arr, i + 1, high);
    
            bars[i + 1].style.height = `${arr[i + 1] * heightScalingFactor}px`;
            bars[i + 1].textContent = arr[i + 1];
            bars[high].style.height = `${arr[high] * heightScalingFactor}px`;
            bars[high].textContent = arr[high];
    
            return i + 1; 
        }
  
        async function iterativeQuickSort(arr) {
            const stack = [];
            stack.push(0);
            stack.push(arr.length - 1);
    
            while (stack.length > 0) {
                const high = stack.pop();
                const low = stack.pop();
    
                const pivotIndex = await partition(arr, low, high);
    
                if (pivotIndex - 1 > low) {
                    stack.push(low);
                    stack.push(pivotIndex - 1);
                }
    
                if (pivotIndex + 1 < high) {
                    stack.push(pivotIndex + 1);
                    stack.push(high);
                }
            }
        }
    
        await iterativeQuickSort(originalHeights);
    
        startButton.disabled = false; 
        isSortingInProgress = false;
    }    

    randomizeButton.addEventListener("click", () => {
        isStopped = true;
        generateBars(arraySizeInput.value)
        startButton.disabled = false;
    });

    startButton.addEventListener("click", () => {
        const order = document.querySelector('input[name="order"]:checked').value; 
        switch(sortingAlgorithm.value) {
            case "Bubble Sort":
                bubbleSort(order);
                break;
            case "Selection Sort":
                selectionSort(order);
                break;
            case "Insertion Sort":
                insertionSort(order);
                break;
            case "Merge Sort":
                mergeSort(order);
                break;
            case "Quick Sort":
                quickSort(order);
                break;
        }
    });
        
    submitButton.addEventListener("click", () => {
        const inputData = inputDataField.value;
        if (inputData) {
            generateBarsFromInput(inputData);
            submittedDataDiv.textContent = `Submitted Data: ${inputData}`;
            inputDataField.value = "";
        } else {
            submittedDataDiv.textContent = "";
        }
    });

    generateBars(arraySizeInput.value);
    
    arraySizeInput.addEventListener("change", () => {
        generateBars(arraySizeInput.value);
    });

    speedSelect.addEventListener("change", setSpeed);
});
