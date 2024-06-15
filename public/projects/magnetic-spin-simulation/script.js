/*
    * 電子デバイスレポート課題1
    * 2264237 松本誠司
    * script.js
    * 別途index.html、style.cssを同ディレクトリに配置しHTMLファイルを実行するとシミュレーションできます。
    * 変数等の設定も実行後のブラウザから行ってください。
*/
// 変数の設定
const spins = [];
let intervalId;
let J_ex;
let intervalTime;
let gridSize;
let numCalculated;
let limit;

// キャンバスの設定
const canvas = document.getElementById("spinCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;

// その他の参照を取得
const inputGridSize = document.getElementById("gridSize");
const inputJ_ex = document.getElementById("J_ex");
const inputInterval = document.getElementById("intervalTime");
const inputNumOfCalculations = document.getElementById("numOfCalculations");
const buttonFaster = document.getElementById("fasterButton");
const buttonSlower = document.getElementById("slowerButton");
const buttonStart = document.getElementById("startButton"); 
const buttonStop = document.getElementById("stopButton");
const buttonContinue = document.getElementById("continueButton");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const tooltip = document.getElementById("tooltip");

// 初期化関数
// spinsは0 <= Θ < 360を持つように設定
function initializeSpins() {
    if (intervalId) {
        clearInterval(intervalId);
    }
    gridSize = parseInt(inputGridSize.value);
    J_ex = parseFloat(inputJ_ex.value);
    intervalTime = parseInt(inputInterval.value);
    numCalculated = 0;
    limit = Number(inputNumOfCalculations.value);
    progressBar.style.width = '0%'; // 進捗バーをリセット
    spins.length = 0;
    for (let i = 0; i < gridSize; i++) {
        spins[i] = [];
        for (let j=0; j < gridSize; j++) {
            spins[i][j] = Math.floor(Math.random() * 360);
        }
    }
}

// スピンを描画
// 描画方法は角度Θの矢印になるように設定
function drawSpins() {
    const cellSize = canvas.width / gridSize;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            drawArrow(i * cellSize + cellSize / 2, j * cellSize + cellSize / 2, cellSize / 2.5, spins[i][j]);
        }
    }
}

// 矢印を描画する関数
function drawArrow(x, y, length, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(-length, -length / 2);
    ctx.lineTo(0, 0);
    ctx.lineTo(-length, length / 2);
    ctx.stroke();
    ctx.restore();
}

// シミュレーションステップを実行する関数
function stepSimulation() {
    if (limit !== 0 && numCalculated >= Number(limit)) {
        alert("計算が" + numCalculated + "回終了しました。")
        exitSimulation();
    }
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    spins[x][y] = calculateNewSpin(x, y);
    drawSpins();
    updateProgressBar();
    numCalculated++;
}

// 進捗バーを更新する関数
function updateProgressBar() {
    const progress = (numCalculated / limit) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${numCalculated}/${limit}`;
}

// 次のスピンを計算する関数
function calculateNewSpin(x, y) {
    const currentSpin = spins[x][y];
    const neighbors = getNeighbors(x, y);
    let minEnergy = Infinity;
    let bestSpin = currentSpin;

    for (let theta = 0; theta < 360; theta++) {
        let energy = 0;
        for (const neighbor of neighbors) {
            energy -= 2 * J_ex * Math.cos((theta - neighbor) * Math.PI / 180)
        }
        if (energy < minEnergy) {
            minEnergy = energy;
            bestSpin = theta;
        }
    }
    return bestSpin;
}

// 周囲のスピンを取得する関数
function getNeighbors(x, y) {
    const neighbors = [];
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1]
    ];
    directions.forEach(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
            neighbors.push(spins[nx][ny]);
        }
    });
    return neighbors;
}

// シミュレーション速度の変更
buttonFaster.addEventListener("click", () => {
    if (intervalTime > 1) {
        intervalTime *= 0.1;
        inputInterval.value = intervalTime;
        clearInterval(intervalId);
        intervalId = setInterval(stepSimulation, intervalTime);
    }
});
buttonSlower.addEventListener("click", () => {
    intervalTime *= 10;
    inputInterval.value = intervalTime;
    clearInterval(intervalId);
    intervalId = setInterval(stepSimulation, intervalTime);
});

// 不必要な欄の有効化・無効化を制御する関数
function disableInputs() {
    inputGridSize.disabled = true;
    inputJ_ex.disabled = true;
    inputInterval.disabled = true;
    inputNumOfCalculations.disabled = true;
    buttonStart.disabled = true;
    buttonContinue.disabled = true;
    buttonStop.disabled = false;
    buttonFaster.disabled = false;
    buttonSlower.disabled = false;
}
function enableInputs() {
    inputGridSize.disabled = false;
    inputJ_ex.disabled = false;
    inputInterval.disabled =false;
    inputNumOfCalculations.disabled = false;
    buttonContinue.disabled = false;
    buttonStart.disabled = false;
    buttonStop.disabled = true;
    buttonFaster.disabled = true;
    buttonSlower.disabled = true;
}

// シミュレーションの開始
buttonStart.addEventListener("click", () => {
    initializeSpins();
    drawSpins();
    disableInputs();
    intervalId = setInterval(stepSimulation, intervalTime);
});

// シミュレーションを終了する関数
function exitSimulation() {
    clearInterval(intervalId);
    enableInputs();
    return;
}

// シミュレーションの中止
buttonStop.addEventListener("click", () => {
    exitSimulation();
    alert("シミュレーションを中止しました。計算回数:" + numCalculated + "回");
})

// シミュレーションの続行
buttonContinue.addEventListener("click", () => {
    if (numCalculated >= limit) {
        limit = 0;
    }
    disableInputs();
    intervalId = setInterval(stepSimulation, intervalTime);
})

// infoアイコンのクリックでツールチップを表示/非表示にする
info.addEventListener("click", (event) => {
    event.stopPropagation(); // クリックイベントが他の要素に伝播するのを防ぐ
    tooltip.classList.toggle("active");
});

// ホバー以外の場所がクリックされたときにツールチップを非表示にする
document.addEventListener("click", (event) => {
    if (!info.contains(event.target)) {
        tooltip.classList.remove("active");
    }
});