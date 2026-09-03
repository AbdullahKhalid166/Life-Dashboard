// ====== DASHBOARD JS ======

// 1️.Get user name ---------------------------------------------
let userName = localStorage.getItem('userName');
if (!userName) {
    userName = prompt("Enter your name:");
    if (userName) localStorage.setItem('userName', userName);
}

// 2️.Clock + greeting function ---------------------------------------
function updateClock() {
    const clockEl = document.getElementById("clock");
    const greetingEl = document.getElementById("greeting");
    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();

    // Display time in HH:MM (24h format) or you can use 12h format if you want
    clockEl.textContent = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}`;

    // Greeting logic
    let timeGreeting = "";
    if (hours >= 0 && hours < 12) timeGreeting = "Good Morning";
    else if (hours >= 12 && hours < 18) timeGreeting = "Good Afternoon";
    else if (hours >= 18 && hours < 24) timeGreeting = "Good Evening";
    else timeGreeting = "Good Night";

    greetingEl.textContent = `${timeGreeting}, ${userName}!`;

    // Image logic: Moon for night (Good Night), Sun for day
    const sunDiv = document.getElementById('sun-icon');
    const moonDiv = document.getElementById('moon-icon');
    if (timeGreeting === "Good Night") {
        if (sunDiv) sunDiv.style.display = 'none';
        if (moonDiv) moonDiv.style.display = 'block';
    } else {
        if (sunDiv) sunDiv.style.display = 'block';
        if (moonDiv) moonDiv.style.display = 'none';
    }
}

// Update immediately and then every minute
updateClock();
setInterval(updateClock, 60 * 1000);

// 3.Quotes rotation -------------------------------------------
const quotes = [
    "Believe you can and you're halfway there.",
    "Do one thing every day that scares you.",
    "Your limitation—it’s only your imagination.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Success doesn’t just find you. You have to go out and get it.",
    "The harder you work for something, the greater you’ll feel when you achieve it.",
    "Don’t stop when you’re tired. Stop when you’re done.",
    "Wake up with determination. Go to bed with satisfaction."
];

const quoteEl = document.getElementById("quote");
function showRandomQuote() {
    const idx = Math.floor(Math.random() * quotes.length);
    quoteEl.textContent = quotes[idx];
}
// Show first quote immediately
showRandomQuote();
// Change every hour
setInterval(showRandomQuote, 60 * 60 * 1000); 

// 4. Sticky Notes -------------------------------------------
const notesPanel = document.getElementById("notesPanel");
const notesBtn = document.getElementById("notesBtn");
const notesClose = document.getElementById("notesClose");
const addNoteBtn = document.getElementById("addNoteBtn");
const notesList = document.getElementById("notesList");
const noteText = document.getElementById("noteText");
const dashboardNotesKey = "dashboardNotes";

// Show/hide panel
notesBtn.addEventListener("click", () => notesPanel.classList.toggle("hidden"));
notesClose.addEventListener("click", () => notesPanel.classList.add("hidden"));

document.addEventListener("DOMContentLoaded", loadNotes);

function loadNotes() {
    let notes = window.readStoredJson(dashboardNotesKey, []);
    notes.forEach(note => addNoteToUI(note)); 
}

addNoteBtn.addEventListener("click", () => {
    const text = noteText.value.trim();
    if (!text) return;

    const id = Date.now(); 
    const note = { id, text, pinned: false };

    addNoteToUI(note);
    saveNote(note);

    noteText.value = "";
});

function saveNote(note) {
    let notes = window.readStoredJson(dashboardNotesKey, []);
    notes.push(note);
    localStorage.setItem(dashboardNotesKey, JSON.stringify(notes));
}

function deleteNote(id) {
    let notes = window.readStoredJson(dashboardNotesKey, []);
    notes = notes.filter(n => n.id !== id);
    localStorage.setItem(dashboardNotesKey, JSON.stringify(notes));
}

function addNoteToUI(note) {
    const li = document.createElement("li");
    li.className = "note-item";
    li.dataset.id = note.id;

    li.style.background = note.pinned ? "#ab3edad9" : "var(--glass)";

    li.innerHTML = `
        <div class="note-text"></div>
        <div class="note-actions">
            <button type="button" class="pin-btn">Pin</button>
            <button type="button" class="delete-btn">Delete</button>
        </div>
    `;
    li.querySelector(".note-text").textContent = note.text;

    li.querySelector(".pin-btn").addEventListener("click", () => {
        let notes = window.readStoredJson(dashboardNotesKey, []);
        const currentNote = notes.find(savedNote => savedNote.id == li.dataset.id);
        const newPinned = !currentNote?.pinned;
        li.style.background = newPinned ? "#5ac06dda" : "var(--glass)";

        notes = notes.map(n =>
            n.id == li.dataset.id ? { ...n, pinned: newPinned } : n
        );

        localStorage.setItem(dashboardNotesKey, JSON.stringify(notes));
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
        deleteNote(parseInt(li.dataset.id));
        li.remove();
    });

    notesList.appendChild(li);
}



// 5. Background chooser -----------------------------------
const bgBtn = document.getElementById("bgBtn");
const bgModal = document.getElementById("bgModal");
const bgClose = document.getElementById("bgClose");
const bgReset = document.getElementById("bgReset");
const dashboard = document.getElementById("dashboardSection");

// Store original background
const originalBg = document.body.style.backgroundImage || "url('assets/images/bg12.jpg')";

// Open panel
bgBtn.addEventListener("click", () => {
    bgModal.classList.remove("hidden");
});

// Close panel
bgClose.addEventListener("click", () => {
    bgModal.classList.add("hidden");
});

// Reset background
bgReset.addEventListener("click", () => {
    document.body.style.backgroundImage = originalBg;
    bgModal.classList.add("hidden");
});

// Change background when image clicked
bgModal.querySelectorAll(".bg-grid img").forEach(img => {
    img.addEventListener("click", () => {
        document.body.style.backgroundImage = `url('${img.src}')`;
    });
});


// 7. Weather widget -------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const weatherBox = document.getElementById("weather");
    const weatherDetails = document.getElementById("weatherDetails");

    // Toggle details panel
    weatherBox.addEventListener("click", () => {
        weatherDetails.style.display = weatherDetails.style.display === "block" ? "none" : "block";
    });

    // Fetch current weather
    function fetchWeather(lat, lon) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data && data.current_weather) {
                    const temp = Math.round(data.current_weather.temperature);
                    const wind = data.current_weather.windspeed;

                    // Set button
                    weatherBox.textContent = `${temp}°C`;

                    // Set details
                    weatherDetails.innerHTML = `
                        <p>Temperature: ${temp}°C</p>
                        <p>Wind: ${wind} km/h</p>
                    `;
                } else {
                    weatherBox.textContent = "—°C";
                    weatherDetails.innerHTML = `<p>No data available</p>`;
                }
            })
            .catch(() => {
                weatherBox.textContent = "—°C";
                weatherDetails.innerHTML = `<p>Error fetching weather</p>`;
            });
    }

    // Get user location
    function getLocationWeather() {
        if (!navigator.geolocation) {
            weatherBox.textContent = "No GPS";
            return;
        }

        navigator.geolocation.getCurrentPosition(
            pos => {
                fetchWeather(pos.coords.latitude, pos.coords.longitude);
            },
            () => {
                weatherBox.textContent = "GPS Off";
            }
        );
    }

    getLocationWeather();
});
