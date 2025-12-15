const startDate = new Date(2025, 11, 14); // Dec 14, 2025

let dailyWord;
let maxGuesses;
let guesses = [];

const board = document.getElementById("board");
const input = document.getElementById("guessInput");
const button = document.getElementById("submitGuess");
const wordLengthEl = document.getElementById("wordLength");

// --- Initialize game for a given date ---
function initGame(chosenDate = null){
  const usedDate = chosenDate || new Date();
  const diffTime = usedDate - startDate;
  let diffDays = Math.floor(diffTime / (1000*60*60*24));

  if(diffDays < 0 || diffDays >= words.length){
    alert("No puzzle for that date!");
    input.disabled = true;
    button.disabled = true;
    return;
  }

  dailyWord = words[diffDays % words.length];
  maxGuesses = dailyWord.length;
  guesses = [];

  board.innerHTML = "";
  input.disabled = false;
  button.disabled = false;
  input.value = "";

  wordLengthEl.textContent = `Today's word has ${dailyWord.length} letters.`;
}

// --- Check if word exists ---
async function isValidWord(word){
  try{
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    return response.ok;
  }catch(e){
    return false;
  }
}

// --- Display guess ---
function displayGuess(guess){
  const row = document.createElement("div");
  for(let i=0; i<dailyWord.length; i++){
    const span = document.createElement("span");
    span.classList.add("letter");
    if(guess[i] === dailyWord[i]){
      span.classList.add("correct");
    } else if(dailyWord.includes(guess[i])){
      span.classList.add("present");
    } else {
      span.classList.add("absent");
    }
    span.textContent = guess[i];
    row.appendChild(span);
  }
  board.appendChild(row);
}

// --- Handle guess submission ---
async function checkGuess(){
  let guess = input.value.toUpperCase();

  // --- Admin mode trigger ---
  if(guess === "SECRET123"){
    const dateInput = prompt("Enter date as YYYY-MM-DD:");
    if(dateInput){
      const newDate = new Date(dateInput);
      initGame(newDate);
    }
    input.value = "";
    return;
  }

  if(guess.length !== dailyWord.length){
    alert(`Guess must be ${dailyWord.length} letters!`);
    return;
  }

  const valid = await isValidWord(guess);
  if(!valid){
    alert("Not a valid English word!");
    return;
  }

  guesses.push(guess);
  displayGuess(guess);
  input.value = "";

  if(guess === dailyWord){
    alert("You got it! 🎉 Come back tomorrow!");
    input.disabled = true;
    button.disabled = true;
  } else if(guesses.length >= maxGuesses){
    alert(`Game over! The word was ${dailyWord}. Come back tomorrow!`);
    input.disabled = true;
    button.disabled = true;
  }
}

// --- Event listeners ---
button.addEventListener("click", checkGuess);
input.addEventListener("keypress", function(e){
  if(e.key === "Enter") checkGuess();
});

// --- Start with today's word ---
initGame();
