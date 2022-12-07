const tasks = []
const addTaskModal = document.getElementById('addTaskModal')
const addTaskButton = document.getElementById('addTask')



function openModal(modalId) {
  modalId.style.display = "block"
}

function closeModal(modalId) {
  modalId.style.display = "none"
}