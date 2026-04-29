let tasks = [];

function save() {
  chrome.storage.local.set({ tasks });
}

function load() {
  chrome.storage.local.get(["tasks"], (data) => {
    tasks = data.tasks || [];
    render();
  });
}

function isBlocked(task) {
  if (!task.dependsOn) return false;
  const parent = tasks.find(t => t.id === task.dependsOn);
  return !parent || parent.status !== "Done";
}

function openCalendar(task) {
  if (!task.date) return alert("Set a date first");
  const date = task.date.replace(/-/g, "");
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(task.task)}&dates=${date}/${date}`;
  chrome.tabs.create({ url });
}

function render() {
  const table = document.getElementById("taskTable");
  const filter = document.getElementById("locationFilter").value;

  table.innerHTML = "";

  tasks.forEach(task => {
    if (filter !== "All" && task.location !== filter) return;

    const row = document.createElement("tr");
    if (isBlocked(task)) row.classList.add("blocked");

    row.innerHTML = `
      <td><input type="checkbox" ${task.status === "Done" ? "checked" : ""}></td>
      <td contenteditable="true">${task.task}</td>
      <td>
        <select>
          <option ${task.location==="Kerala"?"selected":""}>Kerala</option>
          <option ${task.location==="Mumbai"?"selected":""}>Mumbai</option>
          <option ${task.location==="Poothole"?"selected":""}>Poothole</option>
        </select>
      </td>
      <td>
        <select>
          <option ${task.priority==="High"?"selected":""}>High</option>
          <option ${task.priority==="Medium"?"selected":""}>Medium</option>
          <option ${task.priority==="Low"?"selected":""}>Low</option>
        </select>
      </td>
      <td>
        <select>
          <option ${task.status==="Pending"?"selected":""}>Pending</option>
          <option ${task.status==="In Progress"?"selected":""}>In Progress</option>
          <option ${task.status==="Done"?"selected":""}>Done</option>
        </select>
      </td>
      <td><input value="${task.dependsOn || ""}"></td>
      <td><input type="date" value="${task.date || ""}"></td>
      <td><button>📅</button></td>
    `;

    row.querySelector("input[type=checkbox]").onchange = (e) => {
      if (isBlocked(task)) return alert("Task is blocked!");
      task.status = e.target.checked ? "Done" : "Pending";
      save(); render();
    };

    row.children[1].onblur = (e) => {
      task.task = e.target.innerText;
      save();
    };

    const selects = row.querySelectorAll("select");
    selects[0].onchange = (e) => { task.location = e.target.value; save(); };
    selects[1].onchange = (e) => { task.priority = e.target.value; save(); };
    selects[2].onchange = (e) => { task.status = e.target.value; save(); };

    row.querySelector("input[type=date]").onchange = (e) => {
      task.date = e.target.value;
      save();
    };

    row.querySelector("button").onclick = () => openCalendar(task);

    table.appendChild(row);
  });
}

document.getElementById("addTask").onclick = () => {
  tasks.push({
    id: "T" + Date.now(),
    task: "New Task",
    location: "Kerala",
    priority: "Medium",
    status: "Pending",
    dependsOn: null,
    date: ""
  });
  save();
  render();
};

document.getElementById("locationFilter").onchange = render;

load();
