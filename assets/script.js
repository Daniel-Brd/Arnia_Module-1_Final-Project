
// start of modal functions 
//
const taskModal = document.getElementById('taskModal')
const confirmActionModal = document.getElementById('confirmActionModal')
let currentTask = null

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

async function editTaskModal(taskId) {
  currentTask = await getTask(taskId)
  document.getElementById('taskTitle').innerHTML = 'Editar tarefa'
  document.getElementById('numberInput').value = currentTask.Number
  document.getElementById('descriptionInput').value = currentTask.Description
  document.getElementById('dateInput').value = currentTask.Date
  document.getElementById('statusInput').value = currentTask.Status
  openTaskModal()
}
//
// end of modal functions

// start of database functions
//
const taskForm = document.getElementById('taskForm')

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

async function submitTask(task) {
  if (currentTask === null) {
    await createTask(task)
  } else {
    await editTask(currentTask.id, task)
  }
  clearForm()
  closeTaskModal
  location.reload()
}

async function createTask(task) {
  await fetch(`http://localhost:3000/tasks`, {
    method: "POST",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  })
}

async function getTask(taskId) {
  const data = await fetch(`http://localhost:3000/tasks/${taskId}`)
  const task = await data.json()
  return task
}

async function editTask(taskId, task) {
  await fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  })
}

async function deleteTask(taskId) {
  openConfirmActionModal()
  confirmActionModal.innerHTML =
    `<main class="modalContent">
      <h1 class="title">Tem certeza que deseja excluir essa tarefa?</h1>
      <section class="modalButtons">
        <div id="cancelModal" class="cancelModal" onclick="cancelModal()">cancelar</div>
        <button id="confirmDelete" type="button" class="button" onclick="confirmDelete(${taskId})">Sim</button>
      </section>
    </main>`
}

async function confirmDelete(taskId) {
  await fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: "DELETE"
  })
  location.reload()
}
//
// end of database functions

// start of tasks functions
//
const taskTable = document.getElementById('taskTable')
const taskFilters = document.getElementById('tasksFilters')
let currentPage = 1

async function getTasksArray() {
  const data = await fetch(`http://localhost:3000/tasks/`)
  const tasks = await data.json()
  return tasks
}

function tableTempalte(table, tasks) {
  tasks.forEach((task) => {
    const date = new Date(task.Date)
    return table.innerHTML = table.innerHTML +
      `<tr>
      <td id="taskNumber" class="taskCell" scope="row">${task.Number}</th>
      <td id="taskDescription" class="taskCell">${task.Description}</td>
      <td id="taskDate" class="taskCell">${date.toLocaleDateString("pt-BR", { timeZone: "Europe/London" })}</td>
      <td id="taskStatus" class="taskCell ${task.Status.replace(' ', '-')}">${task.Status}</td>
      <td id="taskFunctions" class="taskCell">
        <i id="editButton" class="pointer" onclick="editTaskModal(${task.id})"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.4 13.575H0.6C0.268125 13.575 0 13.8431 0 14.175V14.85C0 14.9325 0.0675 15 0.15 15H14.85C14.9325 15 15 14.9325 15 14.85V14.175C15 13.8431 14.7319 13.575 14.4 13.575ZM2.73188 12C2.76938 12 2.80688 11.9963 2.84438 11.9906L5.99813 11.4375C6.03562 11.43 6.07125 11.4131 6.0975 11.385L14.0456 3.43687C14.063 3.41953 14.0768 3.39892 14.0862 3.37624C14.0956 3.35356 14.1005 3.32924 14.1005 3.30469C14.1005 3.28013 14.0956 3.25582 14.0862 3.23313C14.0768 3.21045 14.063 3.18985 14.0456 3.1725L10.9294 0.054375C10.8938 0.01875 10.8469 0 10.7963 0C10.7456 0 10.6988 0.01875 10.6631 0.054375L2.715 8.0025C2.68687 8.03063 2.67 8.06437 2.6625 8.10188L2.10938 11.2556C2.09113 11.3561 2.09765 11.4594 2.12836 11.5568C2.15907 11.6542 2.21305 11.7426 2.28562 11.8144C2.40937 11.9344 2.565 12 2.73188 12Z"
              fill="#2C2661" />
          </svg>
        </i>
        <i id="deleteButton" class="pointer" onclick="deleteTask(${task.id})"
          ><svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.4167 2.7H11.0833V1.2C11.0833 0.538125 10.5602 0 9.91667 0H4.08333C3.43984 0 2.91667 0.538125 2.91667 1.2V2.7H0.583333C0.260677 2.7 0 2.96813 0 3.3V3.9C0 3.9825 0.065625 4.05 0.145833 4.05H1.24687L1.69714 13.8563C1.7263 14.4956 2.24036 15 2.86198 15H11.138C11.7615 15 12.2737 14.4975 12.3029 13.8563L12.7531 4.05H13.8542C13.9344 4.05 14 3.9825 14 3.9V3.3C14 2.96813 13.7393 2.7 13.4167 2.7ZM9.77083 2.7H4.22917V1.35H9.77083V2.7Z"
              fill="#D7CAE5"/>
          </svg>
        </i>
      </td>
    </tr>`
  })
}

async function addFilterType(filterType) {
  if (!taskFilters.classList.contains(filterType) || taskFilters.classList.contains('search')) {
    taskFilters.className = filterType
    currentPage = 1
    return printTasks(currentPage, itensPerPage)
  } else {
    taskFilters.className = 'noFilters'
    currentPage = 1
    return printTasks(currentPage, itensPerPage)
  }
}

async function tasksFilter() {
  let tasks = await getTasksArray()
  const todayDate = new Date()
  if (taskFilters.classList.contains('forToday')) {
    const dateValue = todayDate.toISOString().slice(0, 10).replaceAll('/', '-')
    tasks = tasks.filter((task) => {
      return task.Date === dateValue
    })
    return tasks
  }
  else if (taskFilters.classList.contains('concluded')) {
    tasks = tasks.filter((task) => {
      return task.Status === 'Concluída'
    })
    return tasks
  }
  else if (taskFilters.classList.contains('in-work')) {
    tasks = tasks.filter((task) => {
      return task.Status === 'Em andamento'
    })
    return tasks
  }
  else if (taskFilters.classList.contains('stopped')) {
    tasks = tasks.filter((task) => {
      return task.Status === 'Paralisada'
    })
    return tasks
  }
  else if (taskFilters.classList.contains('late')) {
    tasks = tasks.filter((task) => {
      return task.Status !== 'Concluída'
    })
    tasks = tasks.filter((task) => {
      const taskDate = new Date(task.Date)
      return taskDate.valueOf() < todayDate.valueOf()
    })
    return tasks
  }
  else if (taskFilters.classList.contains('search')) {
    searchBarValue = document.getElementById('searchBar').value.toLowerCase()
    tasks = tasks.filter((task) => {
      return task.Description.toLowerCase().includes(searchBarValue)
    })
    return tasks
  }
  else if (taskFilters.classList.contains('noFilters')) {
    return tasks
  }
  return tasks
}

async function addSortType(sortType) {
  if (!taskTable.classList.contains(sortType)) {
    taskTable.className = sortType
    return printTasks(currentPage, itensPerPage)
  } else {
    taskTable.className = ''
    return printTasks(currentPage, itensPerPage)
  }
}

async function tasksSort() {
  let tasks = await tasksFilter()
  if (taskTable.classList.contains('number')) {
    tasks.sort(function (a, b) {
      return parseInt(a.Number) < parseInt(b.Number) ? -1 : parseInt(a.Number) > parseInt(b.Number) ? 1 : 0
    })
  } else if (taskTable.classList.contains('description')) {
    tasks.sort(function (a, b) {
      return a.Description < b.Description ? -1 : a.Description > b.Description ? 1 : 0
    })
  } else if (taskTable.classList.contains('date')) {
    tasks.forEach(task => {
      let date = new Date(task.Date)
      task.Date = date.valueOf()
    });
    tasks.sort(function (a, b) {
      return a.Date < b.Date ? -1 : a.Date > b.Date ? 1 : 0
    })
  } else if (taskTable.classList.contains('status')) {
    tasks.sort(function (a, b) {
      return a.Status < b.Status ? -1 : a.Status > b.Status ? 1 : 0
    })
  }
  return tasks
}


const itensPerPage = 8
async function pageNavigate(type) {
  const filteredTasks = await tasksFilter()
  maxPage = Math.ceil(filteredTasks.length / itensPerPage)
  if (type === "next" && currentPage < maxPage) {
    currentPage = currentPage + 1
  }
  else if (type === "previous" && currentPage > 1) {
    currentPage = currentPage - 1
  }
  printTasks(currentPage, itensPerPage)
}


async function printTasks(currentPage, itensPerPage) {
  const tasks = await tasksSort()
  const firstIndex = (currentPage - 1) * itensPerPage
  const lastIndex = firstIndex + itensPerPage
  const page = tasks.slice(firstIndex, lastIndex)
  taskTable.innerHTML = ""
  tableTempalte(taskTable, page)
}

async function pageOnLoad() {
  printTasks(1, itensPerPage)
}


// const indexByNumber = async (number) => {
//   const tasks = await getTasksArray()
//   const index = tasks.findIndex((task) => {
//     if (task.Number === number.toString()) {
//       return true
//     }
//   })
//   return index
// }






// let taskNumbers = {}
// function findRepeated() {
//     tasks.forEach((task) => {
//         taskNumbers[task.Number] = (taskNumbers[task.Number] || 0) + 1
//     })
//     const repeatedValue = Object.keys(taskNumbers).find((number) => {
//         return taskNumbers[number] > 1
//     })
//     return repeatedValue
// }
// console.log(parseInt(findRepeated()))

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
// }
// taskOrganizer()
// console.log(tasks)