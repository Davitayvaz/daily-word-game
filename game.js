// Day 0 = Nov 13, 2026. words[0] is that day's answer.
const startDate = new Date(2026, 10, 13);
startDate.setHours(0, 0, 0, 0);

const MAX_GUESSES = 6;

let dailyWord;
let guesses = [];

// Answers are always accepted as guesses, even if the dictionary API is down
const allWords = new Set(words);

const board = document.getElementById("board");
const input = document.getElementById("guessInput");
const button = document.getElementById("submitGuess");
const wordLengthEl = document.getElementById("wordLength");

// Pick the word for a given date (defaults to today)
function pickWord(forcedDate = null) {
  const date = forcedDate ? new Date(forcedDate) : new Date();
  date.setHours(0, 0, 0, 0);

  // Round so daylight-saving clock changes can't shift the day index
  const dayIndex = Math.round((date - startDate) / 86400000);

  guesses = [];
  board.innerHTML = "";
  input.value = "";
  input.disabled = true;
  button.disabled = true;

  if (dayIndex < 0) {
    dailyWord = null;
    wordLengthEl.textContent = "No puzzle for that date.";
    return;
  }

  if (dayIndex >= words.length) {
    dailyWord = null;
    wordLengthEl.textContent = "No new word yet — check back soon!";
    return;
  }

  dailyWord = words[dayIndex];
  wordLengthEl.textContent = `Today's word has ${dailyWord.length} letters.`;
  input.disabled = false;
  button.disabled = false;
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

// Draw a guess, marking repeats correctly (green first, then yellow)
function drawGuess(guess) {
  const row = document.createElement("div");
  const marks = new Array(guess.length).fill("absent");
  const unmatched = dailyWord.split("");

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === dailyWord[i]) {
      marks[i] = "correct";
      unmatched[i] = null;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (marks[i] === "correct") continue;
    const j = unmatched.indexOf(guess[i]);
    if (j !== -1) {
      marks[i] = "present";
      unmatched[j] = null;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    const box = document.createElement("span");
    box.className = "letter " + marks[i];
    box.textContent = guess[i];
    row.appendChild(box);
  }

  board.appendChild(row);
}

// Handle guess
async function submitGuess() {
  const guess = input.value.toUpperCase();

  // ADMIN MODE: type SECRET123, then a date, to preview another day
  if (guess === "SECRET123") {
    const raw = prompt("Enter date: YYYY-MM-DD");
    if (raw) {
      const [y, m, d] = raw.split("-").map(Number);
      pickWord(new Date(y, m - 1, d));
    }
    input.value = "";
    return;
  }

  if (!dailyWord) return;

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

  if (!allWords.has(guess) && !(await isEnglish(guess))) {
    alert("Not a valid word");
    return;
  }

  guesses.push(guess);
  drawGuess(guess);
  input.value = "";

  if (guesses.length >= MAX_GUESSES) {
    alert(`Out of guesses! Word was ${dailyWord}`);
    input.disabled = true;
    button.disabled = true;
  }
}

button.onclick = submitGuess;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") submitGuess();
});

// Start with today
pickWord();
