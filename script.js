// ─── Constants & Configuration ───────────────────────────────────
const STORAGE_KEY = 'premium-todo-tasks';

// ─── State Management ──────────────────────────────────────────────
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ─── DOM References ────────────────────────────────────────────────
const taskForm    = document.getElementById('todo-form');
const titleInput  = document.getElementById('task-title');
const descInput   = document.getElementById('task-desc');
const taskList    = document.getElementById('task-list');
const emptyState  = document.getElementById('empty-state');
const timeDisplay = document.getElementById('current-time');

// ─── Core Logic ───────────────────────────────────────────────────

/**
 * Persist tasks array to LocalStorage
 */
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Render the full task list and update empty state
 */
function renderTasks() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <span class="task-item-title" title="${escapeHtml(task.title)}">${escapeHtml(task.title)}</span>
            <span class="task-item-desc"  title="${escapeHtml(task.desc)}">${escapeHtml(task.desc)}</span>
            <button class="btn-delete-circle" data-index="${index}" aria-label="Delete Task">
                <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
            </button>
        `;
        taskList.appendChild(li);
    });

    // Re-initialize icons for newly added elements
    if (window.lucide) {
        lucide.createIcons();
    }
}

/**
 * Handle clock update
 */
function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (timeDisplay) timeDisplay.textContent = timeStr;
}

// ─── Event Handlers ───────────────────────────────────────────────

// Form submission handler
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const desc  = descInput.value.trim();

    if (!title || !desc) return;

    // Add to state (at the beginning)
    tasks.unshift({ title, desc });
    
    // Save, Render, Reset
    saveTasks();
    renderTasks();

    titleInput.value = '';
    descInput.value  = '';
    titleInput.focus();
});

// Delete handler using event delegation
taskList.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.btn-delete-circle');
    if (!deleteBtn) return;

    const index = parseInt(deleteBtn.dataset.index, 10);
    
    // Remove with a gentle fade-out if we wanted a more complex animation, 
    // but a simple splice + re-render works well.
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
});

// ─── Initialization ───────────────────────────────────────────────

/**
 * Safe HTML escaping for user inputs
 */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Start live clock
setInterval(updateClock, 1000);
updateClock();

// Perform initial render
window.onload = () => {
    renderTasks();
    if (window.lucide) {
        lucide.createIcons();
    }
};
