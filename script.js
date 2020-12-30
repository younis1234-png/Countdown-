// Split method  https://www.w3schools.com/jsref/jsref_split.asp
// Submit event https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
// https://www.w3schools.com/js/js_timing.asp ==> timing events

const inputContainer = document.getElementById( "input-container" )
const countDownForm = document.getElementById( "countdownForm" )
const dateEl = document.getElementById("date-picker")

// countdown 
const countdownEl = document.getElementById( "countdown" )
const countdownElTitle = document.getElementById( "countdown-title" )
const countdownBtn = document.getElementById( "countdown-button" )
const timeElements = document.querySelectorAll("span")

// Complete
const completeEl = document.getElementById( "complete" )
const completeElInfo = document.getElementById( "complete-info" )
const completeBtn = document.getElementById("complete-button")

let countdownTitle = "";
let countdownDate = "";
let countdownValue = Date;
let countdownActive;
// save in database
let saveCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Date Input Min with Today's Date
// Split because we want everything beofre the T, thats gonna return an array and we want the first 
const today = new Date().toISOString().split("T")[0];
// console.log( today );

// Add our min date attribute to min, which is todays date
dateEl.setAttribute( "min", today )

//  Populate Countdown / complete UI
function updateDOM ()
{
    // to make the function run every second we do the following we wrapped it ina function 
    countdownActive = setInterval( () =>
    {
        // getting the current moment and time from 1970
    const now = new Date().getTime();
    const distance = countdownValue - now;
    // console.log( "distance", distance )

    const days = Math.floor( distance / day )
    // % remainder operator ==> left over of the number at the top
    const hours = Math.floor((distance % day) / hour )
    const minutes = Math.floor((distance % hour) / minute )
    const seconds = Math.floor( ( distance % minute ) / second )
    // console.log(days, hours, minutes,seconds)
     // Hide the input
        inputContainer.hidden = true;
        
        // iF THE COUNTDOWN HAS END IT, SHOW COMPLETE
        if ( distance < 0 )
        {
            countdownEl.hidden = true;
            clearInterval( countdownActive )
            completeElInfo.textContent = `${ countdownTitle } finished on ${ countdownDate } `
            completeEl.hidden = false
        } else
        {
            // show the count down in progress
            // populate our time element 
            countdownElTitle.textContent = `${countdownTitle}`
            timeElements[0].textContent =`${days}`
            timeElements[1].textContent =`${hours}`
            timeElements[2].textContent =`${minutes}`
            timeElements[ 3 ].textContent = `${ seconds }`
            completeEl.hidden = true;
            countdownEl.hidden = false
        }

   }, second)
}

// Take values from Form Input
function updateCountdown ( e )
{
    e.preventDefault()
    countdownTitle = e.srcElement[ 0 ].value
    countdownDate = e.srcElement[ 1 ].value
    // console.log( countdownTitle, countdownDate )


    saveCountdown = {
        title: countdownTitle,
        date: countdownDate,
    }
    console.log( saveCountdown );
    // when it comes to a web server we can only save a string (JSON.tringify comes to play)
    localStorage.setItem( "countdown", JSON.stringify( saveCountdown ) )
        

    // check for valid date 
    if ( countdownDate === ""){
        alert("please select a date for teh countdown")
    } else {
        // Get number of current date and update our dom
    countdownValue = new Date( countdownDate ).getTime()
    // console.log( "countdown value", countdownValue )
    updateDOM()
    }
}

// Reset all values
function reset ()
{
    // Hide countdown, show input
    countdownEl.hidden = true;
    inputContainer.hidden = false;
    completeEl.hidden = true;

    // Stop the count down
    clearInterval( countdownActive )
    
    // Reset the values for our count down title and date
    countdownTitle = "";
    countdownDate = "";
}


// 
function restorePreviousCount ()
{
    // Get countdown from localstorage if available
    if ( localStorage.getItem( "countdown" )){
        inputContainer.hidden = true;
        saveCountdown = JSON.parse( localStorage.getItem( "countdown" ) );
        countdownTitle = saveCountdown.title;
        countdownDate = saveCountdown.date;

        countdownValue = new Date( countdownDate ).getTime();
        updateDOM();
        
        localStorage.removeItem("countdown")
    }
}


// Event listeners, to out form not the button
countDownForm.addEventListener( "submit", updateCountdown )

// Event listener for our count down button
countdownBtn.addEventListener( "click", reset )

// Add event listener tp the button of complete
completeBtn.addEventListener( "click", reset )

// ON load, check localstorage
restorePreviousCount();