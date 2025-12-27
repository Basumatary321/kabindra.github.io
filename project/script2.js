let timeLeft = 10;
let currentSelection = null;
let isSubmitted = false;

// Initialize numbers 0-9
const numberGrid = document.getElementById('numberGrid');
for (let i = 0; i <= 9; i++) {
    const div = document.createElement('div');
    div.className = `num-circle ${i % 2 === 0 ? 'green-bg' : 'red-bg'}`;
    div.innerText = i;
    numberGrid.appendChild(div);
}

function selectOption(choice) {
    if (isSubmitted) return;
    currentSelection = choice;
    document.getElementById('selectionText').innerText = `Selection: ${choice}`;
    
    // Visual feedback for selection
    document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
}

function submitGuess() {
    if (!currentSelection) {
        alert("Please select an option first!");
        return;
    }
    isSubmitted = true;
    document.getElementById('goBtn').disabled = true;
    document.getElementById('resultDisplay').innerText = "Prediction Locked...";
}

function gameLoop() {
    let timerElement = document.getElementById('timer');
    
    let countdown = setInterval(() => {
        timeLeft--;
        timerElement.innerText = `00:${timeLeft < 10 ? '0' + timeLeft : timeLeft}`;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            processResult();
        }
    }, 1000);
}

function processResult() {
    const winningNumber = Math.floor(Math.random() * 10);
    const isEven = winningNumber % 2 === 0;
    const isBig = winningNumber >= 5;
    
    let win = false;
    if (currentSelection === "Big" && isBig) win = true;
    if (currentSelection === "Small" && !isBig) win = true;
    if (currentSelection === "Red" && !isEven) win = true;
    if (currentSelection === "Green" && isEven) win = true;

    const resultBox = document.getElementById('resultDisplay');
    resultBox.innerHTML = `Result: <strong>${winningNumber}</strong> - ${win ? "🎉 YOU WIN!" : "❌ TRY AGAIN"}`;
    resultBox.style.color = win ? "#2ed573" : "#ff4757";

    // Restart game after 3 seconds
    setTimeout(resetGame, 3000);
}

function resetGame() {
    timeLeft = 10;
    currentSelection = null;
    isSubmitted = false;
    document.getElementById('goBtn').disabled = false;
    document.getElementById('selectionText').innerText = "Selection: None";
    document.getElementById('resultDisplay').innerText = "Waiting for next round...";
    document.getElementById('resultDisplay').style.color = "white";
    document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('selected'));
    gameLoop();
}

// Start the first round
gameLoop();