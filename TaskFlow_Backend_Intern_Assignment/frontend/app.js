const API_BASE = "http://127.0.0.1:8000/api/v1";
const tokenKey = "taskflow_access_token";
let currentUser = null;
let tasks = [];
let toastTimer;

const $ = (id) => document.getElementById(id);
const authPanel = $("authPanel");
const appPanel = $("appPanel");
const toast = $("toast");

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.classList.remove("hidden", "error");
  if (isError) toast.classList.add("error");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 3500);
}

function getToken() { return sessionStorage.getItem(tokenKey); }
function setToken(token) { sessionStorage.setItem(tokenKey, token); }
function clearToken() { sessionStorage.removeItem(tokenKey); }

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (getToken()) headers.Authorization = `Bearer ${getToken()}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Array.isArray(data.errors)
      ? data.errors.map((item) => `${item.field}: ${item.message}`).join("; ")
      : (data.detail || "Something went wrong. Please try again.");
    throw new Error(message);
  }
  return data;
}

function setLoggedIn(user) {
  currentUser = user;
  authPanel.classList.add("hidden");
  appPanel.classList.remove("hidden");
  $("userName").textContent = user.name.split(" ")[0];
  $("userMeta").textContent = `${user.email} · ${user.role}`;
  $("adminPanel").classList.toggle("hidden", user.role !== "admin");
}

function setLoggedOut() {
  currentUser = null;
  tasks = [];
  clearToken();
  appPanel.classList.add("hidden");
  authPanel.classList.remove("hidden");
  $("taskList").innerHTML = "";
}

async function loadTasks() {
  const filter = $("filterStatus").value;
  const query = filter ? `?status=${encodeURIComponent(filter)}` : "";
  tasks = await request(`/tasks${query}`);
  renderTasks();
}

function renderTasks() {
  $("totalCount").textContent = tasks.length;
  $("progressCount").textContent = tasks.filter((task) => task.status === "in_progress").length;
  $("doneCount").textContent = tasks.filter((task) => task.status === "done").length;
  const list = $("taskList");
  list.innerHTML = "";
  $("emptyState").classList.toggle("hidden", tasks.length !== 0);
  tasks.forEach((task) => {
    const card = document.createElement("article");
    card.className = "task-card";
    const top = document.createElement("div");
    top.className = "task-card-top";
    const textWrap = document.createElement("div");
    const title = document.createElement("h4");
    title.textContent = task.title;
    const description = document.createElement("p");
    description.textContent = task.description || "No extra notes";
    textWrap.append(title, description);
    const pill = document.createElement("span");
    pill.className = `pill ${task.status}`;
    pill.textContent = { todo: "To do", in_progress: "In progress", done: "Done" }[task.status];
    top.append(textWrap, pill);

    const actions = document.createElement("div");
    actions.className = "task-actions";
    const statusSelect = document.createElement("select");
    statusSelect.setAttribute("aria-label", `Update status for ${task.title}`);
    [["todo","To do"],["in_progress","In progress"],["done","Done"]].forEach(([value,label]) => {
      const option = document.createElement("option");
      option.value = value; option.textContent = label; option.selected = value === task.status;
      statusSelect.append(option);
    });
    statusSelect.addEventListener("change", async () => {
      try { await request(`/tasks/${task.id}`, { method: "PATCH", body: JSON.stringify({ status: statusSelect.value }) }); await loadTasks(); showToast("Task updated."); }
      catch (error) { showToast(error.message, true); }
    });
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", async () => {
      if (!confirm(`Delete "${task.title}"?`)) return;
      try { await request(`/tasks/${task.id}`, { method: "DELETE" }); await loadTasks(); showToast("Task deleted."); }
      catch (error) { showToast(error.message, true); }
    });
    actions.append(statusSelect, deleteButton);
    card.append(top, actions);
    list.append(card);
  });
}

$("registerForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = { name: $("registerName").value, email: $("registerEmail").value, password: $("registerPassword").value };
  try {
    await request("/auth/register", { method: "POST", body: JSON.stringify(payload) });
    showToast("Account created. You can log in now.");
    $("loginEmail").value = payload.email;
    $("loginPassword").value = payload.password;
    $("registerForm").reset();
  } catch (error) { showToast(error.message, true); }
});

$("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const result = await request("/auth/login", { method: "POST", body: JSON.stringify({ email: $("loginEmail").value, password: $("loginPassword").value }) });
    setToken(result.access_token);
    setLoggedIn(result.user);
    await loadTasks();
    showToast("You're logged in. Welcome back!");
  } catch (error) { showToast(error.message, true); }
});

$("taskForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await request("/tasks", { method: "POST", body: JSON.stringify({ title: $("taskTitle").value, description: $("taskDescription").value || null, status: $("taskStatus").value }) });
    $("taskForm").reset();
    await loadTasks();
    showToast("Task added.");
  } catch (error) { showToast(error.message, true); }
});

$("filterStatus").addEventListener("change", () => loadTasks().catch((error) => showToast(error.message, true)));
$("logoutBtn").addEventListener("click", () => { setLoggedOut(); showToast("You've been logged out."); });

$("loadUsersBtn").addEventListener("click", async () => {
  try {
    const users = await request("/admin/users");
    const list = $("userList");
    list.innerHTML = "";
    users.forEach((user) => {
      const row = document.createElement("div");
      row.className = "admin-user";
      const identity = document.createElement("span");
      identity.textContent = `${user.name} · ${user.email}`;
      const role = document.createElement("strong");
      role.textContent = user.role;
      row.append(identity, role);
      list.append(row);
    });
  } catch (error) { showToast(error.message, true); }
});

async function boot() {
  try {
    const response = await fetch("http://127.0.0.1:8000/health");
    $("apiStatus").textContent = response.ok ? "API connected" : "API unavailable";
  } catch {
    $("apiStatus").textContent = "Start the API to connect";
  }
  if (getToken()) {
    try {
      const user = await request("/auth/me");
      setLoggedIn(user);
      await loadTasks();
    } catch { setLoggedOut(); }
  }
}
boot();
