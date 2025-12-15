// Reference date ONLY (does NOT affect real date)
const startDate = new Date(2025, 11, 15);
startDate.setHours(0,0,0,0);

let dailyWord;
let guesses = [];

// Words in words.js are always valid guesses
const exceptionWords = new Set(words.map(w => w.toUpperCase()));

const board = document.getElementById("board");
const input = document.getElementById("guessInput");
const button = document.getElementById("submitGuess");
const wordLengthEl = document.getElementById("wordLength");

// Pick word for a given date
function pickWord(forcedDate = null) {
  const date = forcedDate ? forcedDate : new Date();
  date.setHours(0,0,0,0);

  const diffDays = Math.floor(
    (date - startDate) / 86400000
  );

  if (diffDays < 0 || diffDays >= words.length) {
    alert("No puzzle for that date");
    input.disabled = true;
    button.disabled = true;
    return;
  }

  dailyWord = words[diffDays].toUpperCase();
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
    const r = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    return r.ok;
  } catch {
    return false;
  }
}

// Draw a guess
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

// Handle guess
async function submitGuess() {
  const guess = input.value.toUpperCase();

  // ADMIN MODE
  if (guess === "SECRET123") {
    const raw = prompt("Enter date: YYYY-MM-DD");
    if (raw) {
      const [y,m,d] = raw.split("-").map(Number);
      pickWord(new Date(y, m - 1, d)); // LOCAL date, no UTC bug
    }
    input.value = "";
    return;
  }

  if (guess.length !== dailyWord.length) {
    alert(`Must be ${dailyWord.length} letters`);
    return;
  }

  if (guess === dailyWord) {
    drawGuess(guess);
    alert("You got it 🎉 Come back tomorrow!");
    input.disabled = true;
    button.disabled = true;
    return;
  }

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

  if (guesses.length >= dailyWord.length) {
    alert(`Out of guesses! Word was ${dailyWord}`);
    input.disabled = true;
    button.disabled = true;
  }
}

button.onclick = submitGuess;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") submitGuess();
});

// Start with REAL today
pickWord();
