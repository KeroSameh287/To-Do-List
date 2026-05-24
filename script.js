document.addEventListener("DOMContentLoaded", loadTasks);

document.getElementById("taskInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") addTask();
});

function createTaskElement(taskText, isCompleted) {
  const listItem = document.createElement("li");

  const checkbox = document.createElement("input");

  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.checked = isCompleted;

  const taskSpan = document.createElement("span");

  taskSpan.textContent = taskText;
  taskSpan.className = "task-text";

  if (isCompleted) {
    taskSpan.classList.add("completed");
  }

  checkbox.addEventListener("change", () => {
    taskSpan.classList.toggle("completed", checkbox.checked);

    if (checkbox.checked) {
      document.getElementById("completedList").appendChild(listItem);
    } else {
      document.getElementById("taskList").appendChild(listItem);
    }

    updateTaskCounter();

    saveTasks();
  });

  const editButton = document.createElement("button");

  editButton.innerHTML = "✏️";
  editButton.className = "edit-btn";

  editButton.onclick = () => {
    const oldText = taskSpan.textContent;

    const input = document.createElement("input");

    input.type = "text";
    input.value = oldText;

    input.style.flex = "1";

    listItem.replaceChild(input, taskSpan);

    input.focus();

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        taskSpan.textContent = input.value.trim() || oldText;

        listItem.replaceChild(taskSpan, input);

        saveTasks();
      }
    });
  };

  const removeButton = document.createElement("button");

  removeButton.textContent = "Remove";

  removeButton.className = "remove-btn";

  removeButton.onclick = () => {
    listItem.remove();

    updateTaskCounter();

    saveTasks();
  };

  listItem.appendChild(checkbox);

  listItem.appendChild(taskSpan);

  listItem.appendChild(editButton);

  listItem.appendChild(removeButton);

  return listItem;
}

function addTask() {
  const taskInput = document.getElementById("taskInput");

  const taskText = taskInput.value.trim();

  if (taskText === "") return;

  const task = createTaskElement(taskText, false);

  document.getElementById("taskList").appendChild(task);

  taskInput.value = "";

  updateTaskCounter();

  saveTasks();
}

function saveTasks() {
  const tasks = [];

  document.querySelectorAll("#taskList li, #completedList li").forEach((li) => {
    tasks.push({
      text: li.querySelector(".task-text").textContent,

      completed: li.querySelector(".task-checkbox").checked,
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => {
    const taskElement = createTaskElement(task.text, task.completed);

    if (task.completed) {
      document.getElementById("completedList").appendChild(taskElement);
    } else {
      document.getElementById("taskList").appendChild(taskElement);
    }
  });

  updateTaskCounter();
}

function updateTaskCounter() {
  const total = document.querySelectorAll("#taskList li").length;

  const completed = document.querySelectorAll("#completedList li").length;

  document.getElementById("taskCounter").textContent =
    `${total} task(s), ${completed} completed`;

  document.getElementById("completedCount").textContent = completed;

  document.getElementById("emptyMsg").style.display =
    total === 0 ? "block" : "none";
}

function clearCompletedTasks() {
  document.getElementById("completedList").innerHTML = "";

  updateTaskCounter();

  saveTasks();
}

function toggleCompleted() {
  const completedList = document.getElementById("completedList");

  if (completedList.style.display === "block") {
    completedList.style.display = "none";
  } else {
    completedList.style.display = "block";
  }
}
