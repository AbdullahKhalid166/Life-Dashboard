const tarea = document.getElementById("tarea");
const wordCounter = document.getElementById("word_Counter");
const clearBtn = document.getElementById("Clear");
const notelist = document.getElementById("notelist");
const addBtn = document.getElementById("addBtn");
const deleteBtn = document.getElementById("deleteBtn");
const saveBtn = document.getElementById("saveBtn");
const categories = document.getElementById("categories");

let notes = window.readStoredJson("notes", []);
let selectedNoteIndex = null;

displayNotes();


const notesSection = document.getElementById("notesSection");

notesSection.addEventListener("click", function (e) {
  e.stopPropagation();
});


// Word counter
tarea.addEventListener("input", () => {
  let text = tarea.innerText.trim();
  let words = text ? text.split(/\s+/).length : 0; 
  wordCounter.textContent = "Word Counter : " + words;
});

// Clear textarea
clearBtn.addEventListener("click", () => {
  tarea.innerHTML = "";
  wordCounter.textContent = "Word Counter : 0";
});

// Display notes
function displayNotes() {
  notelist.innerHTML = "";
  const categoriesList = ["Study", "Office", "Personal", "Ideas"];
  categoriesList.forEach(category => {
    const catHeader = document.createElement("h3");
    catHeader.textContent = category;
    notelist.appendChild(catHeader);

    const notesInCategory = notes.filter(note => note.category === category);
    notesInCategory.forEach(note => {
      const div = document.createElement("div");
      div.textContent = note.text.replace(/<[^>]*>/g, "");
      div.classList.add("note");
      div.onclick = () => {
        tarea.innerHTML = note.text;
        selectedNoteIndex = notes.indexOf(note);
      };
      notelist.appendChild(div);
    });
  });
}

// Add note
addBtn.addEventListener("click", () => {
  const text = tarea.innerHTML.trim();
  const category = categories.value;
  if(!text) { alert("Write something!"); return; }
  notes.push({text, category});
  localStorage.setItem("notes", JSON.stringify(notes));
  tarea.innerHTML = "";
  selectedNoteIndex = null;
  displayNotes();
});

// Update note
saveBtn.addEventListener("click", () => {
  if(selectedNoteIndex === null){ alert("Select note first!"); return; }
  notes[selectedNoteIndex].text = tarea.innerHTML;
  localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
});

// Delete note
deleteBtn.addEventListener("click", () => {
  if(selectedNoteIndex === null){ alert("Select note first!"); return; }
  notes.splice(selectedNoteIndex, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  tarea.innerHTML = "";
  selectedNoteIndex = null;
  displayNotes();
});


// Toolbar buttons
const boldBtn = document.querySelector("button[onclick=\"formatText('bold')\"]");
const italicBtn = document.querySelector("button[onclick=\"formatText('italic')\"]");
const underlineBtn = document.querySelector("button[onclick=\"formatText('underline')\"]");
const buttons = [boldBtn, italicBtn, underlineBtn];

// Prevent buttons from stealing focus
buttons.forEach(btn => {
  btn.addEventListener("mousedown", e => {
    e.preventDefault();
    e.stopPropagation();
  });
});

// Apply formatting
function formatText(command) {
  tarea.focus(); // keep cursor in editor
  document.execCommand(command, false, null);
  updateToolbar();
}

// Update toolbar buttons dynamically like MS Word
function updateToolbar() {
  boldBtn.classList.toggle("active", document.queryCommandState("bold"));
  italicBtn.classList.toggle("active", document.queryCommandState("italic"));
  underlineBtn.classList.toggle("active", document.queryCommandState("underline"));
}

// Update when user selects text, types, or moves cursor
tarea.addEventListener("keyup", updateToolbar);
tarea.addEventListener("mouseup", updateToolbar);
tarea.addEventListener("focus", updateToolbar);

// Reset buttons when clicking outside
document.addEventListener("click", () => {
  if (document.activeElement !== tarea) buttons.forEach(btn => btn.classList.remove("active"));
});





function updatePlaceholder() {
    if (tarea.innerText.trim() === "") {
        tarea.classList.add("empty");
    } else {
        tarea.classList.remove("empty");
    }
}

// Initialize placeholder
updatePlaceholder();

// Update placeholder on input, focus, blur
tarea.addEventListener("input", updatePlaceholder);
tarea.addEventListener("blur", updatePlaceholder);
tarea.addEventListener("focus", updatePlaceholder);
