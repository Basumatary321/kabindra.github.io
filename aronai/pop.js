
/* ❌ CLOSE POPUP */
function closeOffer(){
  document.getElementById("festivePopup").classList.remove("active");
}

/* ⏳ 5 DAY COUNTDOWN TIMER */
const timerEl = document.getElementById("timer");

// set end time (5 days from now)
const offerEndTime = new Date().getTime() + (5 * 24 * 60 * 60 * 1000);

function updateFestiveTimer(){
  if(!timerEl) return;

  const now = new Date().getTime();
  const diff = offerEndTime - now;

  if(diff <= 0){
    timerEl.innerHTML = "Offer Expired";
    return;
  }

  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
  const seconds = Math.floor((diff % (1000*60)) / 1000);

  timerEl.innerHTML =
    `${String(days).padStart(2,'0')} :
     ${String(hours).padStart(2,'0')} :
     ${String(minutes).padStart(2,'0')} :
     ${String(seconds).padStart(2,'0')}`;
}

setInterval(updateFestiveTimer, 1000);
updateFestiveTimer();

/* 🔥 FAKE LIVE USERS COUNTER (500 → increasing) */
const claimedText = document.querySelector(".festive-claimed");

let users = 200;

function updateUsers(){
  if(!claimedText) return;

  users += Math.floor(Math.random() * 3); // small random increase
  claimedText.innerHTML = `🔥 ${users}+ users claimed today`;
}

// update every 5 sec
setInterval(updateUsers, 5000);

function openPremiumModal(){
  document.getElementById("festivePopup").classList.add("active");
}





function openColorPopup() {
    document.getElementById('colorPopup').classList.add('show');
}

function closeColorPopup() {
    document.getElementById('colorPopup').classList.remove('show');
}

function openExportMenu() {
    document.getElementById('exportMenu').classList.add('show');
}

function closeDownloadPopup() {
    document.getElementById('exportMenu').classList.remove('show');
}