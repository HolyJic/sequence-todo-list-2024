const currentTimeElement = document.getElementById('current-time');
const toDoForm = document.querySelector(".todo-form");
const toDoList = document.querySelector(".todo-list");
const toggleToDoForm = document.querySelector(".toggle-form");

const TODO_KEY = "toDos";
let toDos = [];

function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  currentTimeElement.textContent = `현재 시간: ${hours}:${minutes}:${seconds}`;
}

  setInterval(updateTime, 1000);
  updateTime();

function registerToDo() {
  toDos.sort((a, b) => new Date(a.date) - new Date(b.date));
  localStorage.setItem(TODO_KEY, JSON.stringify(toDos));
  renderToDos();
}

function doneTask(event) {
  const form = event.target.parentElement;
  form.classList.toggle("done");
  toDos = toDos.map((todo) => {
    if (todo.id == form.id) {
      return { ...todo, done: !todo.done };
    }
    return todo;
  });
  registerToDo();
}

function toggleBtn(target) {
  const actions = target.querySelector(".actions");
  const saveBtn = actions.querySelector(".save_button");
  const editBtn = actions.querySelector(".edit_button");
  saveBtn.hidden = !saveBtn.hidden;
  editBtn.hidden = !editBtn.hidden;
}

function editToDo(event) {
  event.preventDefault();
  const form = event.target.closest(".todo");
  const title = form.querySelector(".title");
  const description = form.querySelector(".description");
  const dueDate = form.querySelector(".duedate");
  title.removeAttribute("disabled");
  description.removeAttribute("disabled");
  dueDate.removeAttribute("disabled");
  dueDate.type = "date";
  toggleBtn(form);
  form.addEventListener("submit", handleEditSubmit);
}

function removeToDo(event) {
  if (!confirm("정말 삭제하시겠습니까?")) return;
  const form = event.target.closest(".todo");
  form.remove();
  toDos = toDos.filter((toDo) => toDo.id !== parseInt(form.id));
  registerToDo();
}

function handleEditSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const doneTask = form.querySelector(".done_task").checked;
  const title = form.querySelector(".title").value;
  const description = form.querySelector(".description").value;
  const dueDate = form.querySelector(".duedate").value;
  const id = parseInt(form.id);

  toDos = toDos.map((toDo) =>
    toDo.id === id ? { ...toDo, title, description, date: dueDate, done: doneTask } : toDo
  );
  registerToDo();
  form.querySelector(".title").setAttribute("disabled", true);
  form.querySelector(".description").setAttribute("disabled", true);
  form.querySelector(".duedate").setAttribute("disabled", true);
  toggleBtn(form);
}

function handleToDoSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const title = form.querySelector(".title").value;
  const description = form.querySelector(".description").value;
  const dueDate = form.querySelector(".duedate").value;
  const newToDoObject = {
    done: false,
    title,
    description,
    date: dueDate,
    id: Date.now(),
  };
  toDos.push(newToDoObject);
  form.reset();
  registerToDo();
  renderToDos();
}

function paintToDo(newToDo) {
  const form = document.createElement("form");
  form.id = newToDo.id;
  form.className = "todo";

  const checkBox = document.createElement("input");
  checkBox.className = "done_task";
  checkBox.type = "checkbox";
  checkBox.checked = newToDo.done;
  if (newToDo.done) {
    form.classList.add("done");
  }

  const title = document.createElement("input");
  title.className = "title";
  title.type = "text";
  title.value = newToDo.title;
  title.setAttribute("disabled", true);

  const description = document.createElement("textarea");
  description.className = "description";
  description.value = newToDo.description;
  description.setAttribute("disabled", true);

  const dueDate = document.createElement("input");
  dueDate.className = "duedate";
  dueDate.type = "date";
  dueDate.value = newToDo.date;
  dueDate.setAttribute("disabled", true);

  const actions = document.createElement("div");
  actions.className = "actions";

  const saveBtn = document.createElement("button");
  const saveSpan = document.createElement("span");
  saveBtn.className = "save_button";
  saveSpan.innerText = "저장";
  saveBtn.appendChild(saveSpan);
  saveBtn.hidden = true;

  const editBtn = document.createElement("button");
  const editSpan = document.createElement("span");
  editBtn.className = "edit_button";
  editSpan.innerText = "수정";
  editBtn.appendChild(editSpan);

  const deleteBtn = document.createElement("button");
  const deleteSpan = document.createElement("span");
  deleteSpan.innerText = "삭제";
  deleteBtn.appendChild(deleteSpan);

  checkBox.addEventListener("click", doneTask);
  editBtn.addEventListener("click", editToDo);
  deleteBtn.addEventListener("click", removeToDo);

  actions.appendChild(saveBtn);
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  form.appendChild(checkBox);
  form.appendChild(title);
  form.appendChild(description);
  form.appendChild(dueDate);
  form.appendChild(actions);

  return form;
}

function renderToDos() {
  toDoList.innerHTML = "";
  toDos.forEach((toDo) => {
    toDoList.appendChild(paintToDo(toDo));
  });
}

toggleToDoForm.addEventListener("click", () => {
  toDoForm.classList.toggle("hide");
});

toDoForm.addEventListener("submit", handleToDoSubmit);

function loadToDos() {
  const savedToDos = localStorage.getItem(TODO_KEY);
  if (savedToDos) {
    toDos = JSON.parse(savedToDos);
  }
  renderToDos();
}

loadToDos();
