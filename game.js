async function checkGuess(){
    let guess = input.value.toUpperCase();
  
    // --- Admin mode ---
    if(guess === "SECRET123"){
      const dateInput = prompt("Enter date as YYYY-MM-DD:");
      if(dateInput){
        const newDate = new Date(dateInput);
        initGame(newDate);
      }
      input.value = "";
      return;
    }
  
    // 1️⃣ Check length
    if(guess.length !== dailyWord.length){
      alert(`Guess must be ${dailyWord.length} letters!`);
      return;
    }
  
    // 2️⃣ Check if it's the correct word
    if(guess === dailyWord){
      displayGuess(guess);
      alert("You got it! 🎉 Come back tomorrow!");
      input.disabled = true;
      button.disabled = true;
      return;
    }
  
    // 3️⃣ Check English word only if not correct word
    const valid = await isValidWord(guess);
    if(!valid){
      alert("Not a valid English word!");
      return;
    }
  
    // 4️⃣ Count as strike
    guesses.push(guess);
    displayGuess(guess);
    input.value = "";
  
    if(guesses.length >= maxGuesses){
      alert(`Game over! The word was ${dailyWord}. Come back tomorrow!`);
      input.disabled = true;
      button.disabled = true;
    }
  }
  async function checkGuess(){
    let guess = input.value.toUpperCase();
  
    // --- Admin mode ---
    if(guess === "SECRET123"){
      const dateInput = prompt("Enter date as YYYY-MM-DD:");
      if(dateInput){
        const newDate = new Date(dateInput);
        initGame(newDate);
      }
      input.value = "";
      return;
    }
  
    // 1️⃣ Check length
    if(guess.length !== dailyWord.length){
      alert(`Guess must be ${dailyWord.length} letters!`);
      return;
    }
  
    // 2️⃣ Check if it's the correct word
    if(guess === dailyWord){
      displayGuess(guess);
      alert("You got it! 🎉 Come back tomorrow!");
      input.disabled = true;
      button.disabled = true;
      return;
    }
  
    // 3️⃣ Check English word only if not correct word
    const valid = await isValidWord(guess);
    if(!valid){
      alert("Not a valid English word!");
      return;
    }
  
    // 4️⃣ Count as strike
    guesses.push(guess);
    displayGuess(guess);
    input.value = "";
  
    if(guesses.length >= maxGuesses){
      alert(`Game over! The word was ${dailyWord}. Come back tomorrow!`);
      input.disabled = true;
      button.disabled = true;
    }
  }
    