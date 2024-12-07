document.addEventListener("DOMContentLoaded", () => {
    const barsContainer = d3.select("#bars-container");
    const randomizeButton = document.getElementById("randomize");
    const startButton = document.getElementById("start");
    const pauseButton = document.getElementById("pause");
    const stopButton = document.getElementById("stop");
    const arraySizeSlider = document.getElementById("array-size");
    const arraySizeValue = document.getElementById("array-size-value");
    const speedSelect = document.getElementById("speed");
    const inputDataField = document.getElementById("input-data");
    const submitButton = document.getElementById("submit");
    const submittedDataDiv = document.getElementById("submitted-data");
    const sortingAlgorithm = document.getElementById("algorithm");

    let bars = [];
    let originalHeights = [];
    let delay = 100;
    const containerHeight = barsContainer.node().clientHeight;

    function setSpeed() {
        const speed = speedSelect.value;
        delay = speed === "Slow" ? 650 : speed === "Moderate" ? 100 : 30;
    }

    function sliderChange() {
        const newSize = parseInt(arraySizeSlider.value);
        arraySizeValue.textContent = newSize; 
        generateBars(newSize); 
    }
    
    window.sliderChange = sliderChange;
    arraySizeSlider.addEventListener("input", sliderChange); 
    
    function generateBars(num = 20) {
        const maxBars = 50; 
        if (num > maxBars) num = maxBars; 
    
        barsContainer.selectAll("*").remove(); 
        bars = [];
        originalHeights = [];
        const barWidth = Math.floor((barsContainer.node().clientWidth / num) - 5); 
    
        for (let i = 0; i < num; i++) {
            const barHeight = Math.floor(Math.random() * 200) + 10; 
            originalHeights.push(barHeight);
        }

       
        barsContainer.selectAll(".bar-wrapper")
            .data(originalHeights)
            .enter()
            .append("div")
            .attr("class", "bar-wrapper")
            .style("width", `${barWidth}px`)
            .append("div")
            .attr("class", "bar")
            .style("height", d => `${(d / 200) * containerHeight * 0.6}px`)
            .style("width", `${barWidth}px`)
            .style("background-color", "#16425B")
            .text(d => d)
            .each(function(d, i) {
                bars.push(d3.select(this));
            });
            
    }
   
    sliderChange(); 

    function generateBarsFromInput(input) {
        const heights = input.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
        barsContainer.selectAll("*").remove();
        bars = [];
        originalHeights = heights;

        const barWidth = Math.floor((barsContainer.node().clientWidth / heights.length) - 5);
        const maxHeight = Math.max(...heights);
        const scalingFactor = containerHeight * 0.6 / maxHeight;

        barsContainer.selectAll(".bar-wrapper")
            .data(heights)
            .enter()
            .append("div")
            .attr("class", "bar-wrapper")
            .style("width", `${barWidth}px`)
            .append("div")
            .attr("class", "bar")
            .style("height", d => `${d * scalingFactor}px`)
            .style("width", `${barWidth}px`)
            .style("background-color", "#6E605F")
            .text(d => d)
            .each(function(d, i) {
                bars.push(d3.select(this));
            });
    }

    let isPaused = false;
    let isStopped = false;
    let isSortInProgress = false;

    startButton.addEventListener("click", () => {
        if (isSortInProgress) {
            startButton.disabled = true;
        }
        if (isStopped) {
            isStopped = false;
        }
    });

    pauseButton.addEventListener("click", () => {
        if (isSortInProgress === false) {
            return;
        }
        if (isSortInProgress === true) {
            isPaused = !isPaused;
            startButton.disabled = true;
        }
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

                
                bars[j].style("background-color", "red");
                bars[j + 1].style("background-color", "red");

                await new Promise(resolve => setTimeout(resolve, delay));

                while (isPaused) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                const height1 = originalHeights[j];
                const height2 = originalHeights[j + 1];

                if ((order === "ascending" && height1 > height2) || (order === "descending" && height1 < height2)) {
                    [originalHeights[j], originalHeights[j + 1]] = [originalHeights[j + 1], originalHeights[j]];

                    bars[j].style("height", `${height2 * heightScalingFactor}px`)
                        .text(height2);
                    bars[j + 1].style("height", `${height1 * heightScalingFactor}px`)
                        .text(height1);
                }

                if (!isPaused) {
                    bars[j].style("background-color", "");
                    bars[j + 1].style("background-color", "");
                }
            }

            bars[bars.length - i - 1].style.backgroundColor = "green";
        }

        startButton.disabled = false;
        isSortInProgress = false;
    }

    generateBars();


    async function selectionSort(order) {
        setSpeed();
        const maxOriginalHeight = Math.max(...originalHeights);
        const heightScalingFactor = containerHeight * 0.6 / maxOriginalHeight;
        isSortInProgress = true;

        for (let i = 0; i < bars.length - 1; i++) {
            let minOrMaxIndex = i;
    
            bars[i].style("background-color", "red");
    
            for (let j = i + 1; j < bars.length; j++) {
                bars[j].style("background-color", "green");
                
                if (isStopped) {
                    bars[i].style("background-color", "");
                    bars[j].style("background-color", "");
                    return;
                }

                await new Promise(resolve => setTimeout(resolve, delay));

                while (isPaused) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                
                const height1 = originalHeights[minOrMaxIndex];
                const height2 = originalHeights[j];
    
                if ((order === "ascending" && height2 < height1) || 
                (order === "descending" && height2 > height1)) {
                    if (minOrMaxIndex !== i) bars[minOrMaxIndex].style("background-color", "");
                    minOrMaxIndex = j;
                    bars[minOrMaxIndex].style("background-color", "blue"); 
                }
                
                bars[j].style("background-color", "");
            }
    
            if (minOrMaxIndex !== i) {
                [originalHeights[i], originalHeights[minOrMaxIndex]] = [originalHeights[minOrMaxIndex], originalHeights[i]];

                bars[i].style("height", `${originalHeights[i] * heightScalingFactor}px`).text(originalHeights[i]);
                bars[minOrMaxIndex].style("height", `${originalHeights[minOrMaxIndex] * heightScalingFactor}px`).text(originalHeights[minOrMaxIndex]);
            }
            
            bars[i].style("background-color", "#16425b");
        }
    
        bars[bars.length - 1].style("background-color", "green");

        startButton.disabled = false; 
        isSortInProgress = false;
    }

    async function insertionSort(order) {
        setSpeed();
        const maxOriginalHeight = Math.max(...originalHeights);
        const heightScalingFactor = containerHeight * 0.6 / maxOriginalHeight;
        isSortInProgress = true;
    
        for (let i = 1; i < bars.length; i++) {
            let j = i;
            const heightToInsert = originalHeights[i];
    
            bars[i].style("background-color", "red");
 
            while (j > 0 && 
                   ((order === "ascending" && originalHeights[j - 1] > heightToInsert) || 
                    (order === "descending" && originalHeights[j - 1] < heightToInsert))) {
    
                originalHeights[j] = originalHeights[j - 1];
                bars[j].style("height", `${originalHeights[j] * heightScalingFactor}px`).text(originalHeights[j]);
                bars[j].style("background-color", "green");
    
                await new Promise(resolve => setTimeout(resolve, delay));

                while (isPaused) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
    
                j--;
            }
    
            originalHeights[j] = heightToInsert;
            bars[j].style("height", `${originalHeights[j] * heightScalingFactor}px`).text(originalHeights[j]);
            bars[j].style("background-color", "#16425b");
        }

        startButton.disabled = false;
        isSortInProgress = false;
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
                    bars[left + i].style("background-color", "");
                    bars[mid + 1 + j].style("background-color", "");
                    return;
                }
    
                
                bars[left + i].style("background-color", "red");
                bars[mid + 1 + j].style("background-color", "red");
    
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
    
               
                bars[k].style("height", `${arr[k] * heightScalingFactor}px`)
                    .text(arr[k]);
    
                k++;
            }
    
            while (i < leftArray.length) {
                arr[k] = leftArray[i];
                bars[k].style("height", `${arr[k] * heightScalingFactor}px`)
                    .text(arr[k]);
                i++;
                k++;
            }
    
            while (j < rightArray.length) {
                arr[k] = rightArray[j];
                bars[k].style("height", `${arr[k] * heightScalingFactor}px`)
                    .text(arr[k]);
                j++;
                k++;
            }
    
      
            for (let index = left; index <= right; index++) {
                bars[index].style("background-color", "#16425b");
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

        for (let i = 0; i < bars.length; i++) {
            bars[i].style.backgroundColor = "green";
        }
    
        startButton.disabled = false;
        isSortInProgress = false;
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
    
                bars[j].style("background-color", "green");
                bars[high].style("background-color", "red");
    
                await new Promise(resolve => setTimeout(resolve, delay));
    
                while (isPaused) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
    
                if ((order === "ascending" && arr[j] <= pivot) || (order === "descending" && arr[j] >= pivot)) {
                    i++;
                    swap(arr, i, j);
    
                  
                    bars[i].style("height", `${arr[i] * heightScalingFactor}px`)
                        .text(arr[i]);
                    bars[j].style("height", `${arr[j] * heightScalingFactor}px`)
                        .text(arr[j]);
                }
    
                bars[j].style("background-color", "");
                bars[high].style("background-color", "");
            }
    
            swap(arr, i + 1, high);
    
            bars[i + 1].style("height", `${arr[i + 1] * heightScalingFactor}px`)
                .text(arr[i + 1]);
            bars[high].style("height", `${arr[high] * heightScalingFactor}px`)
                .text(arr[high]);
    
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
        for (let i = 0; i < bars.length; i++) {
            bars[i].style.backgroundColor = "green";
        }
    
        startButton.disabled = false;
        isSortInProgress = false;
    }
    
    
       
    
    randomizeButton.addEventListener("click", () => {
        isStopped = true;
        isSortInProgress = false;
        generateBars(arraySizeSlider.value)
        startButton.disabled = false;
        for (let i = 0; i < bars.length; i++) {
            bars[i].style.backgroundColor = "";
        }
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

    generateBars(arraySizeSlider.value);
    
    arraySizeSlider.addEventListener("change", () => {
        generateBars(arraySizeSlider.value);
    });

    speedSelect.addEventListener("change", setSpeed);

});