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

// キャンバスの設定
const canvas = document.getElementById("spinCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;

// その他の参照を取得
const inputGridSize = document.getElementById("gridSize");
const inputJ_ex = document.getElementById("J_ex");
const inputInterval = document.getElementById("intervalTime");
const buttonFaster = document.getElementById("fasterButton");
const buttonSlower = document.getElementById("slowerButton");
const buttonStart = document.getElementById("startButton"); 

// 初期化関数
// spinsは0 <= Θ < 360を持つように設定
function initializeSpins() {
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
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    spins[x][y] = calculateNewSpin(x, y);
    drawSpins();
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
    if (intervalTime > 10) {
        intervalTime -= 10;
        inputInterval.value = intervalTime;
        clearInterval(intervalId);
        intervalId = setInterval(stepSimulation, intervalTime);
    }
});
buttonSlower.addEventListener("click", () => {
    intervalTime += 10;
    inputInterval.value = intervalTime;
    clearInterval(intervalId);
    intervalId = setInterval(stepSimulation. intervalTime);
});

// シミュレーションの開始
buttonStart.addEventListener("click", () => {
    if (intervalId) {
        clearInterval(intervalId);
    }
    gridSize = parseInt(inputGridSize.value);
    J_ex = parseFloat(inputJ_ex.value);
    intervalTime = parseInt(inputInterval.value);
    initializeSpins();
    drawSpins();
    setInterval(stepSimulation, intervalTime);
});