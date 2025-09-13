const timerDisplay = document.getElementById("timer");
const phaseDisplay = document.getElementById("phase");
const controlBtn = document.getElementById("controlBtn");
const settingsBtn = document.getElementById("settings");
const modal = document.getElementById("settingsModal");
const saveBtn = document.getElementById("saveSettings");
const alarm = document.getElementById("alarmSound");
const progressBar = document.getElementById("progressBar");

let workDuration = 30;
let thinkDuration = 15;
let relaxDuration = 15;

let phases = [];
let currentPhase = 0;
let timeRemaining = 0;
let timerInterval = null;
let running = false;
let phaseTotal = 0;

const phaseColors = {
  "Deep Work": "#007bff",
  "Deep Think": "#ff9800",
  "Deep Relax": "#28a745",
};

function updateDisplay() {
  const minutes = Math.floor(timeRemaining / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeRemaining % 60).toString().padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;
  const label = phases[currentPhase]?.label || "";
  phaseDisplay.textContent = label;
  progressBar.setAttribute("stroke", phaseColors[label] || "#007bff");
  updateProgress();
}

function updateProgress() {
  const progress = (timeRemaining / phaseTotal) * 628;
  progressBar.setAttribute("stroke-dasharray", 628);
  progressBar.setAttribute("stroke-dashoffset", 628 - progress);
}

function startSession() {
  phases = [
    { label: "Deep Work", duration: workDuration * 60 },
    { label: "Deep Think", duration: thinkDuration * 60 },
    { label: "Deep Relax", duration: relaxDuration * 60 },
  ];
  currentPhase = 0;
  phaseTotal = phases[0].duration;
  timeRemaining = phases[0].duration;
  updateDisplay();
  timerInterval = setInterval(tick, 1000);
  running = true;
  controlBtn.textContent = "Cancel";
}

function playAlarm() {
  alarm.play();
  setTimeout(() => alarm.pause(), 5000);
  alarm.currentTime = 0;
}

function tick() {
  if (timeRemaining > 0) {
    timeRemaining--;
    updateDisplay();
  } else {
    playAlarm();
    currentPhase++;
    if (currentPhase < phases.length) {
      phaseTotal = phases[currentPhase].duration;
      timeRemaining = phases[currentPhase].duration;
      updateDisplay();
    } else {
      clearInterval(timerInterval);
      running = false;
      controlBtn.textContent = "Start";
    }
  }
}

function cancelSession() {
  clearInterval(timerInterval);
  running = false;
  controlBtn.textContent = "Start";
  currentPhase = 0;
  phaseTotal = workDuration * 60;
  timeRemaining = workDuration * 60;
  phases = [
    { label: "Deep Work", duration: workDuration * 60 },
    { label: "Deep Think", duration: thinkDuration * 60 },
    { label: "Deep Relax", duration: relaxDuration * 60 },
  ];
  updateDisplay();
}

controlBtn.addEventListener("click", () => {
  if (!running) {
    startSession();
  } else {
    cancelSession();
  }
});

settingsBtn.addEventListener("click", () => {
  modal.style.display = modal.style.display === "block" ? "none" : "block";
});

saveBtn.addEventListener("click", () => {
  workDuration = parseInt(document.getElementById("workInput").value) || 30;
  thinkDuration = parseInt(document.getElementById("thinkInput").value) || 15;
  relaxDuration = parseInt(document.getElementById("relaxInput").value) || 15;
  modal.style.display = "none";
  cancelSession();
});

// Initialize
cancelSession();
