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
    if (hours >= 5 && hours < 12) timeGreeting = "Good Morning";
    else if (hours >= 12 && hours < 18) timeGreeting = "Good Afternoon";
    else if (hours >= 18 && hours < 22) timeGreeting = "Good Evening";
    else timeGreeting = "Good Night";

    greetingEl.textContent = `${timeGreeting}, ${userName}!`;
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

// Show/hide panel
notesBtn.addEventListener("click", () => notesPanel.classList.toggle("hidden"));
notesClose.addEventListener("click", () => notesPanel.classList.add("hidden"));

/* --------------------
   Load saved notes
-------------------- */
document.addEventListener("DOMContentLoaded", loadNotes);

function loadNotes() {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    notes.forEach(note => {
        addNoteToUI(note.text, note.pinned);
    });
}

/* --------------------
   Add new note
-------------------- */
addNoteBtn.addEventListener("click", () => {
    const text = noteText.value.trim();
    if (!text) return;

    addNoteToUI(text, false);
    saveNote({ text, pinned: false });

    noteText.value = "";
});

/* --------------------
   Save note to localStorage
-------------------- */
function saveNote(note) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
}

/* --------------------
   Delete note from localStorage
-------------------- */
function deleteNote(text) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes = notes.filter(n => n.text !== text);
    localStorage.setItem("notes", JSON.stringify(notes));
}

/* --------------------
   Add note to UI
-------------------- */
function addNoteToUI(text, pinned) {
    const li = document.createElement("li");
    li.className = "note-item";

    li.style.background = pinned ? "green" : "var(--glass)";

    li.innerHTML = `
        <div class="note-text">${text}</div>
        <div class="note-actions">
            <button class="pin-btn">Pin</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    // Pin button
    li.querySelector(".pin-btn").addEventListener("click", () => {
        let notes = JSON.parse(localStorage.getItem("notes")) || [];

        // Toggle pin color
        const newPinned = li.style.background !== "#815ac0";
        li.style.background = newPinned ? "#815ac0" : "var(--glass)";

        // Update saved pinned state
        notes = notes.map(n =>
            n.text === text ? { text: n.text, pinned: newPinned } : n
        );

        localStorage.setItem("notes", JSON.stringify(notes));
    });

    // Delete button
    li.querySelector(".delete-btn").addEventListener("click", () => {
        deleteNote(text);
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
const originalBg = dashboard.style.backgroundImage || "url('assets/images/bg16.jpg')";

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
    dashboard.style.backgroundImage = originalBg;
    bgModal.classList.add("hidden");
});

// Change background when image clicked
bgModal.querySelectorAll(".bg-grid img").forEach(img => {
    img.addEventListener("click", () => {
        dashboard.style.backgroundImage = `url('${img.src}')`;
    });
});


// 6. Responsive side menu -----------------------------
// Get references
const menuBtn = document.getElementById('menuBtn');
const sideMenu = document.getElementById('sideMenu');

// Toggle menu visibility on button click
menuBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent event bubbling if needed
  const isHidden = sideMenu.getAttribute('aria-hidden') === 'true';
  sideMenu.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
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
