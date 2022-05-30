const axios = require('axios')
import '../scss/main.scss'
// VARIABLES
const formEl = document.querySelector('form')
const inputEl = document.querySelector('.form-input')
const contentList = document.querySelector('.content-list')
const addBtn = document.querySelector('.btn__add')
const removeBtn = document.querySelector('.btn__remove')
const modifyBtn = document.querySelector('.btn__modify')
const todoUlEl = document.querySelector('.content-list ul')
const textArea = document.createElement('input')
const selectInput = document.querySelector('.select-input')

let order = 1
let textBoolean = false

// CONSTANT
const URL = 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos'
const API_KEY = 'FcKdtJs202204'
const USERNAME = 'KDT2_LeeKyungTaek'
const headers = {
  'content-type': 'application/json',
  apikey: API_KEY,
  username: USERNAME,
}

// CREATE
async function createTodo(value) {
  if (!value.title.trim()) return
  const { data } = await axios({
    url: URL,
    method: 'POST',
    headers,
    data: {
      // 시용자의 인풋 값
      title: value.title,
      order: value.order,
    },
  })
  console.log(data) // 추가 한 데이터 화면 todos에 추가
  fetchTodo()
}

// READ
async function fetchTodo() {
  const { data } = await axios({
    url: URL,
    method: 'GET',
    headers,
  })
  renderTodo(data)
  console.log(data)
  // data.map((item) => {
  //   deleteTodo(item.id)
  // })
}
fetchTodo()
// DELETE
async function deleteTodo(id) {
  // todo id를 받아서 해당 id todo만 삭제
  const { data } = await axios({
    url: `${URL}/${id}`,
    method: 'DELETE',
    headers,
  })
  fetchTodo()
}
// DELETE DONE TODO
/* async function deleteDoneTodo() {
  await axios ({
    url: URL,
    method: 'DELETE',
    headers,
  })
} */
// PUT done 값
async function putTodoBoolean(boolean, id, value, order) {
  const { data } = await axios({
    url: `${URL}/${id}`,
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      apikey: API_KEY,
      username: USERNAME,
    },
    data: {
      title: value,
      order,
      done: boolean,
    },
  })
  fetchTodo()
}
// PUT title change
async function putTodoTitle(param) {
  const { id, value, done, order } = param
  const { data } = await axios({
    url: `${URL}/${id}`,
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      apikey: API_KEY,
      username: USERNAME,
    },
    data: {
      title: value,
      done: done,
      order,
    },
  })
  fetchTodo()
}

formEl.addEventListener('submit', submitTodo)
addBtn.addEventListener('submit', submitTodo)

// SELECT 입력
selectInput.addEventListener('change', (e) => {
  order = e.target.value
})
// Todo 입력
function submitTodo(e) {
  e.preventDefault()
  // console.log(inputEl.value)
  if (inputEl.value.length > 10) {
    alert('구체적인 것도 좋지만 간단명료하게!')
    inputEl.value = ''
    inputEl.focus()
  } else {
    const value = {
      title: inputEl.value,
      order,
    }
    createTodo(value)
  }
}
// todo render
function renderTodo(todos) {
  resetRender()
  todos.map((todo) => {
    console.log(todo.order)
    const todoItem = document.createElement('li')
    todoItem.setAttribute('id', todo.id)
    const todoText = document.createElement('div')
    todoText.classList.add('todo-content')
    if (todo.done === true) {
      todoText.classList.add('checked')
    }
    todoText.textContent = todo.title
    const value = todo.title
    const checkBox = document.createElement('input')
    checkBox.setAttribute('type', 'checkbox')
    let boolean = todo.done
    checkBox.setAttribute('checked', boolean)
    checkBox.checked = boolean
    checkBox.addEventListener('click', () => {
      todoText.classList.toggle('checked')
      boolean = !boolean
      checkBox.setAttribute('checked', boolean)
      console.log(todo.id, value)
      putTodoBoolean(boolean, todo.id, value, todo.order)
    })
    const renderSelect = document.createElement('div')
    if (todo.order === 1) {
      renderSelect.textContent = '1시간 안에!!!'
    } else if (todo.order === 2) {
      renderSelect.textContent = '반나절 안에!!'
    } else if (todo.order === 3) {
      renderSelect.textContent = '하루 안에!'
    } else {
      renderSelect.textContent = '일주일 안에~'
    }

    const modifyBtn = document.createElement('button')
    modifyBtn.setAttribute('class', 'modify-btn')
    modifyBtn.textContent = '수정'
    modifyBtn.setAttribute('value', value)
    const deleteBtn = document.createElement('button')
    deleteBtn.setAttribute('class', 'delete-btn')
    deleteBtn.textContent = '삭제'
    const updatedTime = document.createElement('span')
    updatedTime.textContent = `Date: ${todo.updatedAt.slice(0, 10)}`
    todoItem.append(checkBox, todoText, modifyBtn, deleteBtn, renderSelect, updatedTime)
    todoUlEl.appendChild(todoItem)
  })
  contentList.appendChild(todoUlEl)
}

function resetRender() {
  todoUlEl.innerHTML = ''
  inputEl.value = ''
}

// delete 로직
contentList.addEventListener('click', (e) => {
  if (e.target.className === 'delete-btn') {
    deleteTodo(e.target.parentNode.id)
  }
  if (e.target.className === 'modify-btn') {
    // 수정 버튼에 대한 이벤트
    const id = e.target.parentNode.id
    const value = e.target.value
    textBoolean = !textBoolean
    if (textBoolean) {
      renderModal(id, value)
    }
  }
})
// modal
function renderModal(id, value) {
  const modalContainer = document.createElement('div')
  modalContainer.classList.add('modal', 'modal-container')
  const modalTitle = document.createElement('div')
  modalTitle.textContent = '수정사항'
  const modifySelect = document.createElement('select')
  modifySelect.innerHTML = `<option value="1">한시간 안에</option>
  <option value="2">반나절 안에</option>
  <option value="3">하루 안에</option>
  <option value="4">일주일 안에</option>`
  const confirmBtn = document.createElement('button')
  textArea.value = value
  confirmBtn.classList.add('confirm-btn')
  confirmBtn.textContent = '확인'
  const cancelBtn = document.createElement('button')
  cancelBtn.classList.add('cancel-btn')
  cancelBtn.textContent = '취소'
  modalContainer.append(modalTitle, textArea, modifySelect, confirmBtn, cancelBtn)
  textArea.addEventListener('input', (e) => {
    value = e.target.value
  })
  modifySelect.addEventListener('change', (e) => {
    order = e.target.value
  })
  modalContainer.addEventListener('click', (e) => {
    if (e.target.className === 'cancel-btn') {
      modalContainer.classList.remove('modal-container')
      textBoolean = !textBoolean
    }
    if (e.target.className === 'confirm-btn') {
      if (textArea.value.length > 10) {
        alert('투두는 간단하게!')
        return
      }
      modalContainer.classList.remove('modal-container')
      textArea.value = value
      textBoolean = !textBoolean
      console.log(id, value, order)
      putTodoTitle({ id, value, order, done: false })
    }
  })

  contentList.appendChild(modalContainer)
}
