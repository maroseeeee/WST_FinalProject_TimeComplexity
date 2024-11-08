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
    const arraySizeInput = document.getElementById("array-size");
    const speedSelect = document.getElementById("speed");
    const inputDataField = document.getElementById("input-data");
    const submitButton = document.getElementById("submit");
    const submittedDataDiv = document.getElementById("submitted-data");

    let bars = [];
    let originalHeights = [];
    let delay = 100;
    const containerHeight = barsContainer.clientHeight;
    let running = true; 

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

    async function bubbleSort(order) {
        setSpeed();
        const maxOriginalHeight = Math.max(...originalHeights);
        const heightScalingFactor = containerHeight * 0.6 / maxOriginalHeight;
    
        for (let i = 0; i < bars.length - 1; i++) {
            for (let j = 0; j < bars.length - i - 1; j++) {
                
                bars[j].style.backgroundColor = "red"; 
                bars[j + 1].style.backgroundColor = "red"; 

                await new Promise(resolve => setTimeout(resolve, delay)); 

                const height1 = originalHeights[j];
                const height2 = originalHeights[j + 1];

                if ((order === "ascending" && height1 > height2) || (order === "descending" && height1 < height2)) {
                    
                    [originalHeights[j], originalHeights[j + 1]] = [originalHeights[j + 1], originalHeights[j]];

                    
                    bars[j].style.height = `${height2 * heightScalingFactor}px`;
                    bars[j].textContent = height2;
                    bars[j + 1].style.height = `${height1 * heightScalingFactor}px`;
                    bars[j + 1].textContent = height1;
                }

                
                bars[j].style.backgroundColor = ""; 
                bars[j + 1].style.backgroundColor = ""; 
            }
           
            bars[bars.length - i - 1].style.backgroundColor = "#6E605F"; 
        }
    }

    randomizeButton.addEventListener("click", () => generateBars(arraySizeInput.value));
    startButton.addEventListener("click", () => {
        running = true; 
        bubbleSort("ascending");
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
