const tasks = []
let currentTask = null
const taskModal = document.getElementById('taskModal')
const confirmActionModal = document.getElementById('confirmActionModal')
const addTaskButton = document.getElementById('addTask')
const deleteButton = document.getElementById('confirmDelete')
const taskForm = document.getElementById('taskForm')

// funções de modal

function openTaskModal() {
  taskModal.style.display = "block"
}

function closeTaskModal() {
  taskModal.style.display = "none"
}

function openConfirmActionModal() {
  confirmActionModal.style.display = "block"
}

function closeConfirmActionModal() {
  confirmActionModal.style.display = "none"
}

function clearForm() {
  document.getElementById('taskTitle').innerHTML = 'Adicionar nova tarefa'
  document.getElementById('numberInput').readOnly = false
  document.getElementById('numberInput').value = ''
  document.getElementById('descriptionInput').value = ''
  document.getElementById('dateInput').value = ''
  document.getElementById('statusInput').value = ''
}

function cancelModal() {
  clearForm()
  closeTaskModal()
  closeConfirmActionModal()
}

editTaskModal = async (Number) => {
  currentTask = await getTask(Number)
  document.getElementById('taskTitle').innerHTML = 'Editar tarefa'
  document.getElementById('numberInput').readOnly = true
  document.getElementById('numberInput').value = currentTask.Number
  document.getElementById('descriptionInput').value = currentTask.Description
  document.getElementById('dateInput').value = currentTask.Date
  document.getElementById('statusInput').value = currentTask.Status
  openTaskModal()
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const taskNumber = taskForm.elements['numberInput'].value
  const taskDescription = taskForm.elements['descriptionInput'].value
  const taskDate = taskForm.elements['dateInput'].value
  const taskStatus = taskForm.elements['statusInput'].value

  const task = {
    Number: taskNumber,
    Description: taskDescription,
    Date: taskDate,
    Status: taskStatus,
  }

  submitTask(task)
})

submitTask = async (task) => {
  if (currentTask === null) {
    await createTask(task)
  } else {
    await editTask(currentTask.Number, task)
  }
  clearForm()
  closeTaskModal
  location.reload()
}

createTask = async (task) => {
  await fetch(`http://localhost:3000/tasks`, {
    method: "POST",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  })
}

getTask = async (Number) => {
  const data = await fetch(`http://localhost:3000/tasks/${Number}`)
  const task = await data.json()
  return task
}

editTask = async (Number, task) => {
  await fetch(`http://localhost:3000/tasks/${Number}`, {
    method: "PUT",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  })
}

deleteTask = async (Number) => {
  openConfirmActionModal()
  confirmActionModal.innerHTML =
    `<main class="modalContent">
      <h1 class="title">Tem certeza que deseja excluir essa tarefa?</h1>
      <section class="modalButtons">
        <div id="cancelModal" class="cancelModal" onclick="cancelModal()">cancelar</div>
        <button id="confirmDelete" type="button" class="button" onclick="confirmDelete(${Number})">Sim</button>
      </section>
    </main>`

  confirmDelete = async (Number) => {
    await fetch(`http://localhost:3000/tasks/${Number}`, {
      method: "DELETE"
    })
    location.reload()
  }
}

// exibição das tarefas

loadTasks = async () => {
  const data = await fetch(`http://localhost:3000/tasks`)
  const tasks = await data.json()

  tasks.sort(function (a, b) {
    return parseInt(a.Number) < parseInt(b.Number) ? -1 : parseInt(a.Number) > parseInt(b.Number) ? 1 : 0;
  });

  printTasks(tasks)
  document.getElementById("numberInput").max = tasks.length + 1
}

printTasks = async (tasks) => {
  const taskTable = document.getElementById('taskTable')
  tasks.forEach((task) => {
    const date = new Date(task.Date)
    taskTable.innerHTML = taskTable.innerHTML +
      `<tr>
        <td id="taskNumber" class="taskCell" scope="row">${task.Number}</th>
        <td id="taskDescription" class="taskCell">${task.Description}</td>
        <td id="taskDate" class="taskCell">${date.toLocaleDateString("pt-BR")}</td>
        <td id="taskStatus" class="taskCell ${task.Status.replace(' ', '-')}">${task.Status}</td>
        <td id="taskFunctions" class="taskCell d-flex gap-3">
          <i id="editButton" onclick="editTaskModal(${task.Number})"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.4 13.575H0.6C0.268125 13.575 0 13.8431 0 14.175V14.85C0 14.9325 0.0675 15 0.15 15H14.85C14.9325 15 15 14.9325 15 14.85V14.175C15 13.8431 14.7319 13.575 14.4 13.575ZM2.73188 12C2.76938 12 2.80688 11.9963 2.84438 11.9906L5.99813 11.4375C6.03562 11.43 6.07125 11.4131 6.0975 11.385L14.0456 3.43687C14.063 3.41953 14.0768 3.39892 14.0862 3.37624C14.0956 3.35356 14.1005 3.32924 14.1005 3.30469C14.1005 3.28013 14.0956 3.25582 14.0862 3.23313C14.0768 3.21045 14.063 3.18985 14.0456 3.1725L10.9294 0.054375C10.8938 0.01875 10.8469 0 10.7963 0C10.7456 0 10.6988 0.01875 10.6631 0.054375L2.715 8.0025C2.68687 8.03063 2.67 8.06437 2.6625 8.10188L2.10938 11.2556C2.09113 11.3561 2.09765 11.4594 2.12836 11.5568C2.15907 11.6542 2.21305 11.7426 2.28562 11.8144C2.40937 11.9344 2.565 12 2.73188 12Z"
                fill="#2C2661" />
            </svg>
          </i>
          <i id="deleteButton" onclick="deleteTask(${task.Number})"
            ><svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.4167 2.7H11.0833V1.2C11.0833 0.538125 10.5602 0 9.91667 0H4.08333C3.43984 0 2.91667 0.538125 2.91667 1.2V2.7H0.583333C0.260677 2.7 0 2.96813 0 3.3V3.9C0 3.9825 0.065625 4.05 0.145833 4.05H1.24687L1.69714 13.8563C1.7263 14.4956 2.24036 15 2.86198 15H11.138C11.7615 15 12.2737 14.4975 12.3029 13.8563L12.7531 4.05H13.8542C13.9344 4.05 14 3.9825 14 3.9V3.3C14 2.96813 13.7393 2.7 13.4167 2.7ZM9.77083 2.7H4.22917V1.35H9.77083V2.7Z"
                fill="#D7CAE5"/>
            </svg>
          </i>
        </td>
      </tr>`
  });
}

// let taskNumbers = {}
// function findRepeated() {
//     tasks.forEach((task) => {
//         taskNumbers[task.Number] = (taskNumbers[task.Number] || 0) + 1
//     })
//     const repeatedValue = Object.keys(taskNumbers).find((number) => {
//         return taskNumbers[number] > 1;
//     })
//     return repeatedValue;
// }
// console.log(parseInt(findRepeated()));

// function taskOrganizer() {
//     // função que converte Number de string para num
//     tasks.forEach(task => {
//         task.Number = parseInt(task.Number)
//     })
//     // função que remove e armazena a ultima posição do vetor, no caso, a nova tarefa
//     lastTask = tasks.pop()
//     // função que altera a numeração de todas as tarefa com numero maior que o da nova tarefa
//     tasks.forEach(task => {
//         if (task.Number >= lastTask.Number) {
//             task.Number = task.Number + 1
//         } else {
//             task.Number = task.Number
//         }
//     })
//     // função que concatena a nova tarefa ao array com numeração alterada
//     tasks.push(lastTask)
//     // função que ordena numeralmente as tarefas
// };
// taskOrganizer()
// console.log(tasks);