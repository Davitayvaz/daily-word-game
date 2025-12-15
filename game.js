// START DATE = TODAY (Dec 15, 2025)
const startDate = new Date(2025, 11, 15);
startDate.setHours(0,0,0,0);

let dailyWord;
let maxGuesses;
let guesses = [];

// Auto-build exception list from words.js
const exceptionWords = new Set(words.map(w => w.toUpperCase()));

const board = document.getElementById("board");
const input = document.getElementById("guessInput");
const button = document.getElementById("submitGuess");
const wordLengthEl = document.getElementById("wordLength");

// Init game
function initGame() {
  const today = new Date();
  today.setHours(0,0,0,0);

  const diffDays = Math.floor((today - startDate) / 86400000);

  if (diffDays < 0 || diffDays >= words.length) {
    alert("No puzzle for today!");
    input.disabled = true;
    button.disabled = true;
    return;
  }

  dailyWord = words[diffDays].toUpperCase();
  maxGuesses = dailyWord.length;
  guesses = [];

  board.innerHTML = "";
  input.value = "";
  input.disabled = false;
  button.disabled = false;

  wordLengthEl.textContent =
    `Today's word has ${dailyWord.length} letters.`;
}

// Dictionary check
async function isEnglish(word) {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    return res.ok;
  } catch {
    return false;
  }
}

// Draw guess
function drawGuess(guess) {
  const row = document.createElement("div");

  for (let i = 0; i < dailyWord.length; i++) {
    const box = document.createElement("span");
    box.className = "letter";

    if (guess[i] === dailyWord[i]) box.classList.add("correct");
    else if (dailyWord.includes(guess[i])) box.classList.add("present");
    else box.classList.add("absent");

    box.textContent = guess[i];
    row.appendChild(box);
  }
  board.appendChild(row);
}

// Guess logic
async function submitGuess() {
  let guess = input.value.toUpperCase();

  // Admin date hack
  if (guess === "SECRET123") {
    const d = prompt("YYYY-MM-DD");
    if (d) initGame(new Date(d));
    input.value = "";
    return;
  }

  if (guess.length !== dailyWord.length) {
    alert(`Must be ${dailyWord.length} letters`);
    return;
  }

  // ✅ Correct word always works
  if (guess === dailyWord) {
    drawGuess(guess);
    alert("Nice 🎉 Come back tomorrow!");
    input.disabled = true;
    button.disabled = true;
    return;
  }

  // ✅ Exception words (auto from words.js)
  if (!exceptionWords.has(guess)) {
    const valid = await isEnglish(guess);
    if (!valid) {
      alert("Not a valid word");
      return;
    }
  }

  guesses.push(guess);
  drawGuess(guess);
  input.value = "";

  if (guesses.length >= maxGuesses) {
    alert(`Out of guesses! Word was ${dailyWord}`);
    input.disabled = true;
    button.disabled = true;
  }
}

button.onclick = submitGuess;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") submitGuess();
});

initGame();
