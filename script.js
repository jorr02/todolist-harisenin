// DOM Elements
const todoForm = document.getElementById('todo-form');
const timeInput = document.getElementById('time-input');
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const addBtn = document.getElementById('add-btn');
const tasksList = document.getElementById('tasks-list');
const deleteAllBtn = document.getElementById('delete-all-btn');
const loginText = document.getElementById('login-text');
const profileBtn = document.getElementById('profile-btn');

// Tasks array and user state
let tasks = [];
let isLoggedIn = false;
let userName = 'User';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    setupLoginHandler();
});

// Setup login handler
function setupLoginHandler() {
    loginText.addEventListener('click', toggleLogin);
    profileBtn.addEventListener('click', toggleLogin);
}

// Toggle login state
function toggleLogin() {
    isLoggedIn = !isLoggedIn;
    if (isLoggedIn) {
        loginText.textContent = `Hi, ${userName}`;
        profileBtn.textContent = userName.charAt(0).toUpperCase();
    } else {
        loginText.textContent = 'Login';
        profileBtn.textContent = '';
    }
}

// Add task event listener
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask();
});

// Add task function
function addTask() {
    const time = timeInput.value;
    const text = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (!time || !text) {
        alert('Please fill in all fields');
        return;
    }

    const task = {
        id: Date.now(),
        time: time,
        text: text,
        priority: priority,
        completed: false,
        overdue: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    // Clear form
    todoForm.reset();
    timeInput.focus();
}

// Render tasks
function renderTasks() {
    tasksList.innerHTML = '';

    if (tasks.length === 0) {
        tasksList.innerHTML = '<div class="empty-message">No tasks yet. Add one to get started!</div>';
        return;
    }

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksList.appendChild(taskElement);
    });
}

// Create task element
function createTaskElement(task) {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''} ${task.overdue ? 'overdue' : ''}`;
    taskItem.id = `task-${task.id}`;

    taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
        <div class="task-info">
            <div class="task-time">${task.time}</div>
            <div class="task-text">${task.text}</div>
            <div class="task-badges">
                ${task.overdue ? '<span class="overdue-badge">OVERDUE</span>' : ''}
                <span class="priority-badge priority-${task.priority}">${task.priority.toUpperCase()}</span>
            </div>
        </div>
        <div class="task-actions">
            <button class="task-overdue-btn" data-id="${task.id}">${task.overdue ? 'Clear Overdue' : 'Mark Overdue'}</button>
            <button class="task-delete-btn" data-id="${task.id}">Delete</button>
        </div>
    `;

    // Checkbox event listener
    const checkbox = taskItem.querySelector('.task-checkbox');
    checkbox.addEventListener('change', () => {
        toggleTaskComplete(task.id);
    });

    // Overdue button event listener
    const overdueBtn = taskItem.querySelector('.task-overdue-btn');
    overdueBtn.addEventListener('click', () => {
        toggleTaskOverdue(task.id);
    });

    // Delete button event listener
    const deleteBtn = taskItem.querySelector('.task-delete-btn');
    deleteBtn.addEventListener('click', () => {
        deleteTask(task.id);
    });

    return taskItem;
}

// Toggle task completion
function toggleTaskComplete(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Toggle task overdue
function toggleTaskOverdue(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.overdue = !task.overdue;
        saveTasks();
        renderTasks();
    }
}

// Delete single task
function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();
    renderTasks();
}

// Delete all tasks
deleteAllBtn.addEventListener('click', () => {
    if (tasks.length === 0) {
        alert('No tasks to delete!');
        return;
    }

    if (confirm('Are you sure you want to delete all tasks? This cannot be undone.')) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
});

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}


