const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const datePicker = document.getElementById("task-date-picker");
const prioritySelect = document.getElementById("task-priority");
const list = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");

let tasks = [];
let activeFilter = "all"; // track current active tab

window.tasks = tasks;
// Sound for completed task
const taskCompleteSound = new Audio("/asssets/audio/acheivement.mp3");

// Load tasks on page load
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  const defaultTab = document.querySelector(".task-tabs button[data-filter='all']");
  if(defaultTab) defaultTab.classList.add("active");
});

// Save tasks to localStorage
function saveTasks(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks(){
    const saved = localStorage.getItem("tasks");
    const loadedTasks = saved ? JSON.parse(saved) : [];

    tasks.length = 0;
    tasks.push(...loadedTasks);

    renderTasks(activeFilter);
    if(window.loadPendingTasks) window.loadPendingTasks(); // sync Focus module
}


// Add task
form.addEventListener("submit", e => {
  e.preventDefault();
  const taskText = input.value.trim();
  if(!taskText) return;

  const newTask = {
    text: taskText,
    date: datePicker.value,
    priority: prioritySelect.value,
    completed: false
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks(activeFilter);
  if (window.loadPendingTasks) window.loadPendingTasks();  // sync Focus Timer
  input.value = "";
});

// Render tasks
function renderTasks(filter="all"){
  list.innerHTML = "";
  let filtered = tasks;
  if(filter === "pending") filtered = tasks.filter(t => !t.completed);
  if(filter === "completed") filtered = tasks.filter(t => t.completed);

  if(filtered.length === 0){
    emptyMessage.style.display = "block";
    return;
  }
  emptyMessage.style.display = "none";

  filtered.forEach(task => {
    const li = document.createElement("li");
    let priorityClass = task.priority === "High" ? "priority-high" :
                        task.priority === "Medium" ? "priority-medium" :
                        "priority-low";
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""}>
      <span>${task.text} <span class="${priorityClass}">${task.priority}</span> (${task.date || "No date"})</span>
      <div class="task-btns">
        <button class="edit-btn"><i class="fa-regular fa-pen-to-square"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    li.querySelector("input").addEventListener("change", () => {
      task.completed = !task.completed;
      if(task.completed) {
        taskCompleteSound.play();
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
      saveTasks();
      renderTasks(activeFilter);
      if (window.loadPendingTasks) window.loadPendingTasks();
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks = tasks.filter(t => t !== task);
      saveTasks();
      renderTasks(activeFilter);
        if (window.loadPendingTasks) window.loadPendingTasks();

    });

    li.querySelector(".edit-btn").addEventListener("click", () => {
      input.value = task.text;
      datePicker.value = task.date;
      prioritySelect.value = task.priority;
      tasks = tasks.filter(t => t !== task);
      saveTasks();
      renderTasks(activeFilter);
      if (window.loadPendingTasks) window.loadPendingTasks();
    });

    if(task.completed) li.classList.add("completed");
    list.appendChild(li);
  });

  updateStats();
}

// Update stats
function updateStats(){
  document.getElementById("total").textContent = `${tasks.length} TOTAL TASKS`;
  document.getElementById("pending").textContent = `${tasks.filter(t => !t.completed).length} PENDING`;
  document.getElementById("completed").textContent = `${tasks.filter(t => t.completed).length} COMPLETED`;
}

// Clear completed tasks
document.getElementById("clear-completed").addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks(activeFilter);
});

// Sorting
document.getElementById("sortTasks").addEventListener("change", e => {
  const type = e.target.value;
  if(type === "priority") {
    const order = {High:1, Medium:2, Low:3};
    tasks.sort((a,b) => order[a.priority] - order[b.priority]);
  } else if(type === "date") {
    tasks.sort((a,b) => new Date(a.date) - new Date(b.date));
  }
  saveTasks();
  renderTasks(activeFilter);
});

renderTasks(activeFilter);
if(window.loadPendingTasks) window.loadPendingTasks();

// Filter tabs
const tabButtons = document.querySelectorAll(".task-tabs button");
tabButtons.forEach(btn => {
  const filter = btn.dataset.filter;
  if(filter){
    btn.addEventListener("click", () => {
      activeFilter = filter;
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderTasks(activeFilter);
    });
  }
});

// View toggle
document.getElementById("listView").addEventListener("click", () => list.classList.remove("grid-view"));
document.getElementById("gridView").addEventListener("click", () => list.classList.add("grid-view"));
