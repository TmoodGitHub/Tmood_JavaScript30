const secondHand = document.querySelector('.second-hand');
const minuteHand = document.querySelector('.min-hand');
const hourHand = document.querySelector('.hour-hand');
const clock = document.querySelector('.clock');
let tzSelection =  document.querySelector('#timezone');

setDate();

function setDate(){
    let TZ = 0;
    if(tzSelection.value === "EST"){
        TZ = 0;
    }
    else if(tzSelection.value === "CST"){
        TZ = -1;
    }
    else if(tzSelection.value === "MST"){
        TZ = -2;
    }
    else if(tzSelection.value === "PST"){
        TZ = -3;
    }

    const now = new Date();
    const seconds = now.getSeconds();
    const secondsDeg = ((seconds / 60) * 360);

    const minutes = now.getMinutes();
    const minutesDeg = ((minutes / 60) * 360);

    const hours = now.getHours() + TZ;
    const hoursDeg = ((hours / 12) * 360);
    
    secondHand.style.transform = `rotate(${secondsDeg}deg)`;
    minuteHand.style.transform = `rotate(${minutesDeg}deg)`;
    hourHand.style.transform = `rotate(${hoursDeg}deg)`;
}

function spinClock(){
    if(clock.classList.contains("spinClock")){
        clock.classList.remove("spinClock");
        setTimeout(function(){
            clock.classList.add("spinClock");
        }, 100);
    }
    else{
        clock.classList.add("spinClock");
    }
}

function operateClock(){
    spinClock();
    setDate();
}

setInterval(setDate, 1000);