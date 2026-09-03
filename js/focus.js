const timerDisplay = document.getElementById('focusTimer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const extendBtn = document.getElementById('extendBtn');
const bgAudio = document.getElementById('bgAudio');
const bgAudioSelect = document.getElementById('bgAudioSelect');
const sessionReport = document.getElementById('sessionReport');
const taskSelect = document.getElementById('taskSelect');
const circle = document.querySelector('.progress-ring__circle');
const radius = 120;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = circumference;


let timer = 25 * 60; // 25 min in seconds
let interval = null;
let startTime = null;
let isPaused = false;

function setVolume(value) {
    bgAudio.volume = value;       // change the actual audio volume
    bgVolume.value = value;       // sync the slider visually
}



// Update timer display
function updateTimerDisplay() {
    const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
    const seconds = String(timer % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;

    const progress = timer / (25 * 60);
    circle.style.strokeDashoffset = circumference * (1 - progress);
}


// Timer countdown
function startTimer() {
    if (interval) return;

    interval = setInterval(() => {
        timer--;
        updateTimerDisplay();

        if (timer <= 0) {
            clearInterval(interval);
            interval = null;
            bgAudio.pause();
            reportSession();
        }
    }, 1000);

    // ▶ Resume audio only if selected
    if (bgAudioSelect.value && bgAudio.paused) {
        bgAudio.play().catch(() => {});
    }

    isPaused = false;
}



// Pause timer
function pauseTimer() {
    if (!interval) return;

    clearInterval(interval);
    interval = null;

    bgAudio.pause();
    isPaused = true;
}



// Stop timer
function stopTimer() {
    clearInterval(interval);
    interval = null;

    timer = 25 * 60;
    updateTimerDisplay();

    bgAudio.pause();
    bgAudio.currentTime = 0; // rewind
    isPaused = false;
}



// Extend timer
function extendTimer() {
    timer += 5 * 60;
    updateTimerDisplay();
}

// Background audio
bgAudioSelect.addEventListener('change', () => {
    const sound = bgAudioSelect.value;

    if (!sound) {
        bgAudio.pause();
        bgAudio.src = '';
        return;
    }

    bgAudio.src = `assets/audios/${sound}.mpeg`;
    bgAudio.muted = false;
    setVolume(bgVolume.value);
    bgAudio.load();

    bgAudio.play().catch(err => {
        console.error('Audio failed:', err);
    });
});





// Session report
function reportSession() {
    const minutesFocused = Math.floor(25 - timer / 60);
    const task = taskSelect.value || "No task selected";
    sessionReport.replaceChildren();
    const summary = document.createElement("p");
    summary.textContent = `You focused for ${minutesFocused} minutes on: ${task}`;
    const recommendation = document.createElement("p");
    recommendation.textContent = "Next break recommended: 5 minutes";
    sessionReport.append(summary, recommendation);
}

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
stopBtn.addEventListener('click', stopTimer);
extendBtn.addEventListener('click', extendTimer);

// Populate tasks from To-Do (example)
function loadPendingTasks() {
    const taskSelect = document.getElementById('taskSelect');

    if(!window.tasks) return;

    // Filter pending tasks
    const pendingTasks = window.tasks.filter(t => !t.completed);

    taskSelect.innerHTML = '';

    if(pendingTasks.length === 0){
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No pending tasks';
        taskSelect.appendChild(option);
        return;
    }

    pendingTasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task.text; // task text, can use unique ID if needed
        option.textContent = task.text;
        taskSelect.appendChild(option);
    });
}

// Make it globally accessible so app.js can call it
window.loadPendingTasks = loadPendingTasks;

const bgVolume = document.getElementById('bgVolume');

// Set initial volume
setVolume(bgVolume.value);


// Update audio volume when slider changes
bgVolume.addEventListener('input', () => {
    setVolume(bgVolume.value);
});



loadPendingTasks();
updateTimerDisplay();