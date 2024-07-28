const inputSlider = document.querySelector("[data-lengthSlider]")
const lengthDisplay = document.querySelector("[data-lengthNumber]")
const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const copyButton = document.querySelector("[data-copy]")
const copyMessage = document.querySelector("[data-copyMessage]")
const uppercaseCheck = document.querySelector("#uppercase")
const lowercaseCheck = document.querySelector("#lowercase")
const numbersCheck = document.querySelector("#numbers")
const symbolsCheck = document.querySelector("#symbols")
const indicator = document.querySelector("[data-indicator]")
const generateButton = document.querySelector(".generate-button")
const allCheckbox = document.querySelectorAll("input[type=checkbox]")
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRandomInteger(0, 9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97, 123))
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65, 91))
}

function generateSymbol(){
    const randomNumber = getRandomInteger(0, symbols.length);
    return symbols.charAt(randomNumber);
}

function calculateStrength(){
    let hasUppercase = false;
    let hasLowercase = false;
    let hasNumbers = false;
    let hasSymbols = false;
    if(uppercaseCheck.checked) hasUppercase = true;
    if(lowercaseCheck.checked) hasLowercase = true;
    if(numbersCheck.checked) hasNumbers = true;
    if(symbolsCheck.checked) hasSymbols = true;

    if(hasUppercase && hasLowercase && (hasNumbers || hasSymbols) && passwordLength >= 8 ){
        setIndicator("#0f0");
    }
    else if((hasLowercase || hasUppercase) && (hasNumbers || hasSymbols) && passwordLength >= 6 ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMessage.innerText = "Copied";
    }
    catch(e){
        copyMessage.innerText = "Failed"; 
    }
    copyMessage.classList.add("active");
    setTimeout( () => {
        copyMessage.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckboxChange(){
    checkCount = 0;
    allCheckbox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckbox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyButton.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generateButton.addEventListener('click', () => {
    if(checkCount == 0) return;
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    password = "";

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArray = [];
    if(uppercaseCheck.checked)
        funcArray.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArray.push(generateLowerCase);
    if(numbersCheck.checked)
        funcArray.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funcArray.push(generateSymbol);

    for(let i = 0; i < funcArray.length; i++){
        password += funcArray[i]();
    }
    
    for(let i = 0; i < passwordLength-funcArray.length; i++){
        let randomText = getRandomInteger(0, funcArray.length);
        password += funcArray[randomText]();
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;
    calculateStrength();
})