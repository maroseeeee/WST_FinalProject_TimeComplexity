document.addEventListener("DOMContentLoaded", () => {
    const bubbleBarsContainer = d3.select("#bubble-bars-container");
    const selectionBarsContainer = d3.select("#selection-bars-container");
    const insertionBarsContainer = d3.select("#insertion-bars-container");
    const mergeBarsContainer = d3.select("#merge-bars-container");
    const quickBarsContainer = d3.select("#quick-bars-container");

    const randomizeButton = document.getElementById("randomize");
    const startButton = document.getElementById("start");
    const pauseButton = document.getElementById("pause");
    const stopButton = document.getElementById("stop");
    const arraySizeSlider = document.getElementById("array-size-slider");
    const arraySizeValue = document.getElementById("array-size-value");
    const speedSelect = document.getElementById("speed");
    const inputDataField = document.getElementById("input-data");
    const submitButton = document.getElementById("submit");

    bars = [];
    let originalHeights = [];
    let delay = 100;
    let savedArrays = []; 
    let currentArrayIndex = -1;

    const containerHeight = bubbleBarsContainer.node().clientHeight;

    function setSpeed() {
        const speed = speedSelect.value;
        delay = speed === "Slow" ? 650 : speed === "Moderate" ? 100 : 30;
    }

    function sliderChange() {
        const newSize = parseInt(arraySizeSlider.value);
        arraySizeValue.textContent = newSize;
        generateBars(newSize, [bubbleBarsContainer, selectionBarsContainer, insertionBarsContainer, mergeBarsContainer, quickBarsContainer]);
    
    }
    window.sliderChange = sliderChange;
    arraySizeSlider.addEventListener('input', sliderChange);

    function generateBars(num = 20, containers = [bubbleBarsContainer, selectionBarsContainer, insertionBarsContainer, mergeBarsContainer, quickBarsContainer]) {
        const maxBars = 20;
        if (num > maxBars) num = maxBars;

      
        originalHeights = [];
        for (let i = 0; i < num; i++) {
            const barHeight = Math.floor(Math.random() * 200 + 10);
            originalHeights.push(barHeight);
        }
        savedArrays.push([...originalHeights]); 
        currentArrayIndex = savedArrays.length - 1;

       
        console.log("Original Heights: ", originalHeights);
        console.log("Container Height: ", bubbleBarsContainer.node().clientHeight);

       
        containers.forEach(cont => {
            cont.selectAll("*").remove(); 

            const barWidth = Math.floor(bubbleBarsContainer.node().clientWidth / num) - 5;
            const maxHeight = Math.max(...originalHeights);
            const scalingFactor = containerHeight * 0.6 / maxHeight;

            cont.selectAll(".bar-wrapper")
                .data(originalHeights)
                .enter()
                .append("div")
                .attr("class", "bar-wrapper")
                .style("width", `${barWidth}px`)
                .append("div")
                .attr("class", "bar")
                .style("height", d => `${d * scalingFactor}px`)
                .style("width", `${barWidth}px`)
                .style("background-color", "#16425B")
                .text(d => d)
                .each(function(d, i) {
                    bars.push(d3.select(this));
                });
        });
    }
    sliderChange();

    function generateBarsFromInput(input) {
        const heights = input.split(',').map(num => parseFloat(num.trim())).filter(num => !isNaN(num));
        if (heights.length > 0) {
            originalHeights = heights;
            const barWidth = (bubbleBarsContainer.node().clientWidth / heights.length) - 5;
            const maxHeight = Math.max(...heights);
            const scalingFactor = containerHeight * 0.6 / maxHeight;

            [bubbleBarsContainer, selectionBarsContainer, insertionBarsContainer, mergeBarsContainer, quickBarsContainer].forEach(container => {
                container.selectAll("*").remove();
                bars = [];
                container.selectAll(".bar-wrapper")
                    .data(heights)
                    .enter()
                    .append("div")
                    .attr("class", "bar-wrapper")
                    .style("width", `${barWidth}px`)
                    .append("div")
                    .attr("class", "bar")
                    .style("height", d => `${d * scalingFactor}px`)
                    .style("width", `${barWidth}px`)
                    .style("background-color", "#16425b")
                    .text(d => d)
                    .each(function (d, i) {
                        bars.push(d3.select(this));
                    });
            });
        }
    }

    submitButton.addEventListener("click", () => {
        const inputData = inputDataField.value;
        if (inputData) {
            generateBarsFromInput(inputData);
            inputDataField.value = "";            
            originalHeights = inputData.split(",").map(Number);        
            savedArrays.push([...originalHeights]);
            currentArrayIndex = savedArrays.length - 1;
        }
    });
    

    let isPaused = false;
    let isStopped = false;
    let isSortInProgress = false;
    let elapsedTime = 0;
    let timerIntervals = {};
    let algorithmStatus = {
        bubble: false,
        selection: false,
        insertion: false,
        merge: false,
        quick: false
    };

    startButton.addEventListener("click", async () => {
        if (isSortInProgress) {
            startButton.disabled = true;
          
        }

        if (isStopped) {
            isStopped = false;
        }

        const order = document.querySelector('input[name="order"]:checked').value;
        isSortInProgress = true;
        elapsedTime = 0; 
         
        const bubbleHeights = [...originalHeights];
        const selectionHeights = [...originalHeights];
        const insertionHeights = [...originalHeights];
        const mergeHeights = [...originalHeights];
        const quickHeights = [...originalHeights];

        timerIntervals = {}; 

        await Promise.all([
            bubbleSort(order, bubbleBarsContainer, bubbleHeights),
            selectionSort(order, selectionBarsContainer, selectionHeights),
            insertionSort(order, insertionBarsContainer, insertionHeights),
            mergeSort(order, mergeBarsContainer, mergeHeights),
            quickSort(order, quickBarsContainer, quickHeights)
        ]);

      
    });

    pauseButton.addEventListener("click", () => {
        if (!isSortInProgress) {
            return;
        }
        if (isSortInProgress && !isPaused) {
            isPaused = true;
            
            for (const key in timerIntervals) {
                clearInterval(timerIntervals[key]);
            }
            startButton.disabled = false;
        } else if (isSortInProgress && isPaused) {
            isPaused = false;
            startButton.disabled = true;
            
            for (const key in timerIntervals) {
                startTimer(key);
            }
        }
    });

    stopButton.addEventListener("click", () => {
        isStopped = true;
        isPaused = false;
        isSortInProgress = false;
    
     
        for (const key in timerIntervals) {
            clearInterval(timerIntervals[key]);
        }

        if (currentArrayIndex >= 0 && savedArrays[currentArrayIndex]) {
            originalHeights = [...savedArrays[currentArrayIndex]];
            generateBarsFromInput(originalHeights.join(","));
        }
    
        
        for (const key in timerIntervals) {
            const timeElement = document.getElementById(`${key}-time`);
            if (timeElement) {
                timeElement.innerText = 0; 
            }
        }
    
        startButton.disabled = false;
    });

    function startTimer(algorithmName) {
        const timeElement = document.getElementById(`${algorithmName}-time`);
        const startTime = Date.now() - elapsedTime * 1000;
    
        timerIntervals[algorithmName] = setInterval(() => {
            if (!isPaused) {
                elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                timeElement.innerText = elapsedTime;
            }
        }, 1000);
    }
    function startAlgorithm(algorithmName) {
        algorithmStatus[algorithmName] = true;
    }
    
    function stopAlgorithm(algorithmName) {
        algorithmStatus[algorithmName] = false;
    }

    async function bubbleSort(order, container, heights) {
        setSpeed();
        const bars = [];
        container.selectAll(".bar").each(function () {
            const bar = d3.select(this);
            bars.push(bar);
        });
    
        const containerHeight = container.node().clientHeight;
        const maxOriginalHeight = Math.max(...heights);
        const heightScalingFactor = (containerHeight * 0.6) / maxOriginalHeight;
    
        startAlgorithm("bubble");
        startTimer("bubble");
        isSortInProgress = true;
    
        for (let i = 0; i < heights.length - 1; i++) {
            let swapped = false;
            for (let j = 0; j < heights.length - i - 1; j++) {
                if (isStopped) {
                    clearInterval(timerIntervals["bubble"]);
                    stopAlgorithm("bubble");
                    return;
                }
    
                bars[j].style("background-color", "red");
                bars[j + 1].style("background-color", "red");
    
                await new Promise(resolve => setTimeout(resolve, delay));
    
                while (isPaused) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
    
                const height1 = heights[j];
                const height2 = heights[j + 1];
    
                if ((order === "ascending" && height1 > height2) || (order === "descending" && height1 < height2)) {
                    [heights[j], heights[j + 1]] = [heights[j + 1], heights[j]];
    
                    bars[j].style("height", `${heights[j] * heightScalingFactor}px`).text(heights[j]);
                    bars[j + 1].style("height", `${heights[j + 1] * heightScalingFactor}px`).text(heights[j + 1]);
    
                    swapped = true;
                }
    
                bars[j].style("background-color", "#16425B");
                bars[j + 1].style("background-color", "#16425B");
            }
    
            if (!swapped) break;
        }
        clearInterval(timerIntervals["bubble"]);
        startButton.disabled = false;
        isSortInProgress = false;
        stopAlgorithm("bubble");

    }
    
    async function selectionSort(order, container, heights) {
        setSpeed();
        const bars = [];
        container.selectAll(".bar").each(function () {
            const bar = d3.select(this);
            bars.push(bar);
        });
    
        const containerHeight = container.node().clientHeight;
        const maxOriginalHeight = Math.max(...heights);
        const heightScalingFactor = (containerHeight * 0.6) / maxOriginalHeight;
    
        startAlgorithm("selection");
        startTimer("selection");
        isSortInProgress = true;

    
        for (let i = 0; i < heights.length - 1; i++) {
    
            let minIndex = i;
    
            for (let j = i + 1; j < heights.length; j++) {
                if (isStopped) {
                    isSortInProgress = false;
                    clearInterval(timerIntervals["selection"]);
                    stopAlgorithm("selection");
                    return;
                }
    
                bars[j].style("background-color", "green");
                bars[minIndex].style("background-color", "red");
    
                await new Promise(resolve => setTimeout(resolve, delay));
    
                while (isPaused) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
    
                if ((order === "ascending" && heights[j] < heights[minIndex]) || 
                    (order === "descending" && heights[j] > heights[minIndex])) {
                    bars[minIndex].style("background-color", "#16425b");
                    minIndex = j;
                } else {
                    bars[j].style("background-color", "#16425b");
                }
            }
    
            if (minIndex !== i) {
                [heights[i], heights[minIndex]] = [heights[minIndex], heights[i]];
          
                bars[i]
                    .style("height", `${heights[i] * heightScalingFactor}px`)
                    .text(heights[i]);
            
                bars[minIndex]
                    .style("height", `${heights[minIndex] * heightScalingFactor}px`)
                    .text(heights[minIndex]);
            }
            
    
            bars[minIndex].style("background-color", "#16425b");
            bars[i].style("background-color", "#16425b");
        }
    
        bars[heights.length - 1].style("background-color", "#16425b");
    
        clearInterval(timerIntervals["selection"]);
        startButton.disabled = false;
        isSortInProgress = false;
        stopAlgorithm("selection");
    }
    
    async function insertionSort(order, container, heights) {
        setSpeed();
        const bars = [];
        container.selectAll(".bar").each(function () {
            const bar = d3.select(this);
            bars.push(bar);
        });
    
        const containerHeight = container.node().clientHeight;
        const maxOriginalHeight = Math.max(...heights);
        const heightScalingFactor = (containerHeight * 0.6) / maxOriginalHeight;
    
        startAlgorithm("insertion");
        startTimer("insertion");
        isSortInProgress = true;

        for (let i = 1; i < heights.length; i++) {
            let j = i;
            const heightToInsert = heights[i];
    
            bars[i].style("background-color", "red");
    
            while (j > 0 &&
                ((order === "ascending" && heights[j - 1] > heightToInsert) ||
                 (order === "descending" && heights[j - 1] < heightToInsert))) {

                    if (isStopped) {
                        clearInterval(timerIntervals["insertion"]);
                        stopAlgorithm("insertion");
                        return; 
                    }
                    bars[j - 1].style("background-color", "red");
    
                heights[j] = heights[j - 1];
                bars[j].style("height", `${heights[j] * heightScalingFactor}px`).text(heights[j]);
                bars[j].style("background-color", "green");
    
                await new Promise(resolve => setTimeout(resolve, delay));
    
                while (isPaused) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
    
                j--;
            }
    
            heights[j] = heightToInsert;
            bars[j].style("height", `${heightToInsert * heightScalingFactor}px`).text(heightToInsert);
            bars[j].style("background-color", "#16425b");
        }
        clearInterval(timerIntervals["insertion"]);
        startButton.disabled = false;
        isSortInProgress = false;
        stopAlgorithm("insertion");
       
        bars.forEach(bar => {
            bar.style("background-color", "#16425b");
        });
    }

    async function mergeSort(order, container, heights) {
        setSpeed();
        const bars = [];
        
        container.selectAll(".bar").each(function() {
            const bar = d3.select(this);
            bars.push(bar);
        });
    
        const containerHeight = container.node().clientHeight;
        const maxOriginalHeight = Math.max(...heights);
        const heightScalingFactor = containerHeight * 0.6 / maxOriginalHeight;
    
        startAlgorithm("merge");
        startTimer("merge");
        isSortInProgress = true;
    
        async function merge(arr, left, mid, right) {
            let leftArray = arr.slice(left, mid + 1);
            let rightArray = arr.slice(mid + 1, right + 1);
            let i = 0, j = 0, k = left;
    
            while (i < leftArray.length && j < rightArray.length) {
                if (isStopped) {
                   bars[left + i].style("background-color", "");
                    bars[mid + 1 + j].style("background-color", "");
                    clearInterval(timerIntervals["merge"]);
                    return;
                }
    
                bars[left + i].style("background-color", "red");
                bars[mid + 1 + j].style("background-color", "red");
    
                await new Promise(resolve => setTimeout(resolve, delay));
    
                while (isPaused) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
    
                if ((order === "ascending" && leftArray[i] <= rightArray[j]) || 
                    (order === "descending" && leftArray[i] >= rightArray[j])) {
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
                if (isStopped) {
                    clearInterval(timerIntervals["merge"]);
                    return;
                }
                arr[k] = leftArray[i];
                bars[k].style("height", `${arr[k] * heightScalingFactor}px`)
                    .text(arr[k]);
                i++;
                k++;
            }
    
            while (j < rightArray.length) {
                if (isStopped) {
                    clearInterval(timerIntervals["merge"]);
                    return;
                }
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
    
                    if (isStopped) {
                        clearInterval(timerIntervals["merge"]);
                        return;
                    }
    
                    await merge(arr, leftStart, mid, rightEnd);
                }
            }
        }
    
        await iterativeMergeSort(heights);
    
        for (let i = 0; i < bars.length; i++) {
            bars[i].style.backgroundColor = "green";
        }
    
        
        clearInterval(timerIntervals["merge"]);
        startButton.disabled = false;
        isSortInProgress = false;
        stopAlgorithm("merge");
    }
    
    
    async function quickSort(order, container, heights) {
        setSpeed();
        const bars = [];
        container.selectAll(".bar").each(function() {
            const bar = d3.select(this);
            bars.push(bar);
        });

        const containerHeight = container.node().clientHeight;
        const maxOriginalHeight = Math.max(...heights);
        const heightScalingFactor = containerHeight * 0.6 / maxOriginalHeight;
  
        startAlgorithm("quick");
        startTimer("quick");
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
                    clearInterval(timerIntervals["quick"]);
                    stopAlgorithm("merge");
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
      
        clearInterval(timerIntervals["quick"]);
        startButton.disabled = false;
        isSortInProgress = false;
        stopAlgorithm("merge");
    }



    randomizeButton.addEventListener("click", () => {
        isStopped = true;
        isSortInProgress = false;
        
        for (const key in timerIntervals) {
            clearInterval(timerIntervals[key]);
        }

        for (const key in timerIntervals) {
            const timeElement = document.getElementById(`${key}-time`);
            if (timeElement) {
                timeElement.innerText = 0; 
            }
        }
        const newSize = parseInt(arraySizeSlider.value);

        generateBars(newSize, [bubbleBarsContainer, selectionBarsContainer, insertionBarsContainer, mergeBarsContainer, quickBarsContainer]);

        startButton.disabled = false;

        for (let i = 0; i < bars.length; i++) {
            bars[i].style.backgroundColor = "";
        }
    });

   
    

   generateBars(20, [bubbleBarsContainer, selectionBarsContainer, insertionBarsContainer, mergeBarsContainer, quickBarsContainer]);


    speedSelect.addEventListener("change", setSpeed);
});
