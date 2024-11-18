

// Function to load the welcome message
function loadWelcomeMessage() {
  const user = getUserData();
  if (user) {
    // Display user's name if logged in
    document.getElementById('welcomeMessage').innerHTML = `Welcome, ${user.name}!`;
  } else {
    // Display a guest message if no user is logged in
    document.getElementById('welcomeMessage').innerHTML = 'Welcome, Guest!';
  }
}

// Function to load tasks
function loadTasks() {
  const taskTable = document.getElementById('task-table').getElementsByTagName('tbody')[0];
  taskTable.innerHTML = ''; // Clear existing tasks
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach((task, index) => {
    const taskRow = document.createElement('tr');
    taskRow.innerHTML = `
      <td>${task.name}</td>
      <td>${task.category}</td>
      <td>${task.dueDate}</td>
      <td>${task.status}</td>
      <td>
        <button onclick="editTask(${index})">Edit</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </td>
    `;
    taskTable.appendChild(taskRow);
  });
}

// Function to get user data
function getUserData() {
  return JSON.parse(localStorage.getItem('userCredentials')) || null;
}

// Call loadWelcomeMessage when the page loads
window.onload = function() {
  loadWelcomeMessage(); // Load the user's welcome message
  loadTasks(); // Load the tasks
};

// Show Add Task Form
document.getElementById('show-add-task-form').addEventListener('click', function() {
  openAddTaskModal(); // Open the task modal
});

// Open the task modal for adding or editing tasks
function openAddTaskModal(index = -1) {
  document.getElementById('taskModal').style.display = 'block'; // Show the modal
  if (index !== -1) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks[index];
    // Pre-fill the form with task details
    document.getElementById('taskName').value = task.name;
    document.getElementById('taskDesc').value = task.description;
    document.getElementById('taskDate').value = task.dueDate;
    document.getElementById('taskTime').value = task.time;
    document.getElementById('taskCategory').value = task.category;
    document.getElementById('taskReminder').value = task.reminder;
    // Update modal title and button text
    document.getElementById('modalTitle').textContent = "Edit Task";
    document.getElementById('saveButton').textContent = "Save Changes";
  } else {
    // Clear the form for a new task
    document.getElementById('taskName').value = '';
    document.getElementById('taskDesc').value = '';
    document.getElementById('taskDate').value = '';
    document.getElementById('taskTime').value = '';
    document.getElementById('taskCategory').value = '';
    document.getElementById('taskReminder').value = '';
    // Update modal title and button text
    document.getElementById('modalTitle').textContent = "Add New Task";
    document.getElementById('saveButton').textContent = "Save Task";
  }
}

// Save Task
function saveTask(event) {
  event.preventDefault(); // Prevent form submission
  const taskName = document.getElementById('taskName').value.trim();
  const taskDesc = document.getElementById('taskDesc').value.trim();
  const taskDate = document.getElementById('taskDate').value.trim();
  const taskTime = document.getElementById('taskTime').value.trim();
  const taskCategory = document.getElementById('taskCategory').value.trim();
  const taskReminder = document.getElementById('taskReminder').value.trim();
  const status = getTaskStatus(`${taskDate}T${taskTime}`);
  if (taskName && taskDesc && taskDate && taskTime && taskCategory && taskReminder) {
    const task = {
      name: taskName,
      description: taskDesc,
      dueDate: taskDate,
      time: taskTime,
      category: taskCategory,
      reminder: taskReminder,
      status: status,
    };
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // Add new task or update existing task
    if (document.getElementById('modalTitle').textContent === 'Edit Task') {
      tasks[editingIndex] = task; // Edit task
    } else {
      tasks.push(task); // New task
    }
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save to localStorage
    closeAddTaskModal(); // Close modal
    loadTasks(); // Reload task list
  } else {
    alert('Please fill in all fields');
  }
}


// Close the task modal
function closeAddTaskModal() {
  document.getElementById('taskModal').style.display = 'none';
}

// Delete Task
function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.splice(index, 1); // Remove task from array
  localStorage.setItem('tasks', JSON.stringify(tasks)); // Update localStorage
  loadTasks(); // Reload task list
}

// Edit Task
let editingIndex = -1;
function editTask(index) {
  editingIndex = index; // Store the index of the task being edited
  openAddTaskModal(index); // Open modal for editing
}

// Function to determine task status based on the due date
function getTaskStatus(dueDate) {
  const currentDate = new Date(); // Get the current date
  const taskDueDate = new Date(dueDate); // Convert the due date to a Date object

  // Compare current date with the task's due date
  if (taskDueDate < currentDate) {
      return 'Completed'; // Task is completed if the due date is in the past
  } else {
      return 'Pending'; // Task is pending if the due date is in the future
  }
}
