const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const progressBar = document.getElementById("progress-bar");
const minBtn = document.getElementById("min-btn");

let tasks = [];

// Load tasks
if (window.api) {
  window.api.loadTasks().then(loaded => {
    tasks = loaded || [];
    renderTasks();
  });
} else {
  console.error("window.api is not available!");
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ text, done: false });
  taskInput.value = "";
  renderTasks();
  saveTasks();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  renderTasks();
  saveTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
  saveTasks();
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""}>
      <span style="${task.done ? "text-decoration: line-through;" : ""}">${task.text}</span>
      <button class="delete-btn">&times;</button>
    `;

    li.querySelector("input").addEventListener("change", () => toggleTask(i));
    li.querySelector(".delete-btn").addEventListener("click", () => deleteTask(i));

    taskList.appendChild(li);
  });
  updateProgress();
}

function updateProgress() {
  const doneCount = tasks.filter(t => t.done).length;
  const progress = tasks.length ? (doneCount / tasks.length) * 100 : 0;
  progressBar.style.width = progress + "%";
}

function saveTasks() {
  if (window.api) {
    window.api.saveTasks(tasks);
  }
}

// Event listeners
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

if (minBtn) {
  minBtn.addEventListener("click", () => {
    if (window.api) window.api.minimize();
  });
}

