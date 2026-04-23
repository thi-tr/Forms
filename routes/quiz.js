const express = require('express')
const router = express.Router();
const {readFile} = require('fs').promises;
//work goes here

router.get("/", async (req,res)=>{
    //Get 4 words, with their pos and def and send back to their other page
    let chosenWords = await getWords();
    //send those back and redner quiz.ejs
    console.log("Chosen Words: ", chosenWords);
    res.render('quiz', {chosenWords});
});
router.post("/", async (req,res)=>{
    console.log(req.body);
    //7 variables rendered
    let chosenWords = req.body.chosenWords;
    const chosenWord = req.body.chosenWord;
    const isAnswered = (req.body.isAnswered === 'true'); //reads boolean because of req.body
    const userChoice = req.body.userChoice;
    const correctDef = req.body.correctDef;
    const totalQuestions = parseInt(req.body.totalQuestions); //error, string concatenation
    const totalCorrect = parseInt(req.body.totalCorrect);


    let score = 0;
    let total;
    //renders correct answer of previous word question
    if(isAnswered){
        if(userChoice === correctDef){
            console.log("User guessed correctly!");
            score = totalCorrect +1;
        }else{
            console.log("User guessed incorrectly!");
            score = totalCorrect;
        }
        total = totalQuestions + 1;
        //console.log("Test");
        res.render('quiz', {isAnswered: isAnswered, chosenWords:chosenWords, chosenWord:chosenWord,
                            totalQuestions:total, totalCorrect:score, userChoice:userChoice, 
                            correctDef:correctDef}); 
    //renders new chosenWords and new question
    }else{
        score = totalCorrect;
        total = totalQuestions;
        chosenWords = await getWords();
        console.log("Chosen Words: ", chosenWords);
        res.render('quiz', {isAnswered: isAnswered, chosenWords:chosenWords, chosenWord:chosenWord,
                            totalQuestions:total, totalCorrect:score, userChoice:userChoice, 
                            correctDef:correctDef});
    }
});


let getWords = async ()=>{
    //get a random part of speech
    console.log("Getting random part!")
    let randomPart = getRandomPart(); //i should have noun verb or adjective
    //based on that, pick 4 words that match
    console.log("Random part: ", randomPart);
    let allWords = await readFile('resources/allwords.txt', 'utf8'); //Reads allwords as 1 giant string
    // console.log(allWords);
    let wordArray = allWords.split('\n'); //splits the single string into an array where each line is an index
    // console.log(wordArray);
    shuffle(wordArray); //shuffle that array

    let choices = [];
    while(choices.length < 5){ //keep looping until we get 5 choices
        let line = wordArray.pop();
        // let [word, part, def] = line.split('\t'); This is the same as the code below
        let tokens = line.split('\t');
        let word = tokens[0];
        let part = tokens[1];
        let def = tokens [2];
        if (part === randomPart){ //If the part of my word matches the random part we picked, we keep it
            choices.push(line)
        }
    }
    return choices;
}
let getRandomPart = ()=>{
    let parts = ['noun', 'verb', 'adjective'];
    let randomIndex = Math.floor(Math.random()*parts.length);
    let randomPart = parts[randomIndex];
    return randomPart;
}

let shuffle = (array) =>{
    //fisher Yates algorithm
    for(let i=array.length-1; i>0; i--){
        let randomNumber = Math.floor(Math.random()*(i+1));
        [array[i], array[randomNumber]] = [array[randomNumber], array[i]];
    }
    console.log("Array shuffled!")
}


module.exports = router