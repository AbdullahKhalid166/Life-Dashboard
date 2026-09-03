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
const taskCompleteSound = new Audio("assets/audios/acheivement.mp3");

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
    const loadedTasks = window.readStoredJson("tasks", []);

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
    updateStats();
    return;
  }
  emptyMessage.style.display = "none";

  filtered.forEach(task => {
    const li = document.createElement("li");
    let priorityClass = task.priority === "High" ? "priority-high" :
                        task.priority === "Medium" ? "priority-medium" :
                        "priority-low";
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} aria-label="Complete task">
      <span><span class="task-text"></span> <span class="${priorityClass}">${task.priority}</span> (${task.date || "No date"})</span>
      <div class="task-btns">
        <button type="button" class="edit-btn" aria-label="Edit task"><i class="fa-regular fa-pen-to-square"></i></button>
        <button type="button" class="delete-btn" aria-label="Delete task"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    li.querySelector(".task-text").textContent = task.text;

    li.querySelector("input").addEventListener("change", () => {
      task.completed = !task.completed;
      if(task.completed) {
        taskCompleteSound.play().catch(() => {});
        if (typeof confetti === "function") {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
      }
      saveTasks();
      renderTasks(activeFilter);
      if (window.loadPendingTasks) window.loadPendingTasks();
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks.splice(tasks.indexOf(task), 1);
      saveTasks();
      renderTasks(activeFilter);
        if (window.loadPendingTasks) window.loadPendingTasks();

    });

    li.querySelector(".edit-btn").addEventListener("click", () => {
      input.value = task.text;
      datePicker.value = task.date;
      prioritySelect.value = task.priority;
      tasks.splice(tasks.indexOf(task), 1);
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
  for (let index = tasks.length - 1; index >= 0; index--) {
    if (tasks[index].completed) tasks.splice(index, 1);
  }
  saveTasks();
  renderTasks(activeFilter);
  if (window.loadPendingTasks) window.loadPendingTasks();
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
const listViewButton = document.getElementById("listView");
const gridViewButton = document.getElementById("gridView");

listViewButton.addEventListener("click", () => {
  list.classList.remove("grid-view");
  listViewButton.setAttribute("aria-pressed", "true");
  gridViewButton.setAttribute("aria-pressed", "false");
});

gridViewButton.addEventListener("click", () => {
  list.classList.add("grid-view");
  listViewButton.setAttribute("aria-pressed", "false");
  gridViewButton.setAttribute("aria-pressed", "true");
});
