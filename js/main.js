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
let order = 0
let textBoolean = false
let value

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
  const { id, value, done } = param
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
    },
  })
  fetchTodo()
}

formEl.addEventListener('submit', submitTodo)
addBtn.addEventListener('submit', submitTodo)

// Todo 입력
function submitTodo(e) {
  e.preventDefault()
  // console.log(inputEl.value)
  if (inputEl.value.length > 10) {
    alert('구체적인 것도 좋지만 간단명료하게!')
    inputEl.value = ''
    inputEl.focus()
  } else {
    let value = {
      title: inputEl.value,
      order: (order += 1),
    }
    createTodo(value)
  }
}
// todo render
function renderTodo(todos) {
  order = todos.order
  resetRender()
  todos.map((todo) => {
    const todoItem = document.createElement('li')
    todoItem.setAttribute('id', todo.id)
    const todoText = document.createElement('div')
    if (todo.done === true) {
      todoText.classList.add('checked')
    }
    todoText.textContent = todo.title
    value = todo.title
    const checkBox = document.createElement('input')
    checkBox.setAttribute('type', 'checkbox')
    let boolean = todo.done
    checkBox.setAttribute('checked', boolean)
    checkBox.checked = boolean
    checkBox.addEventListener('click', () => {
      todoText.classList.toggle('checked')
      boolean = !boolean
      checkBox.setAttribute('checked', boolean)
      putTodoBoolean(boolean, todo.id, value, order)
    })
    const modifyBtn = document.createElement('button')
    modifyBtn.setAttribute('class', 'modify-btn')
    modifyBtn.textContent = '수정'
    modifyBtn.setAttribute('value', value)
    const deleteBtn = document.createElement('button')
    deleteBtn.setAttribute('class', 'delete-btn')
    deleteBtn.textContent = '삭제'
    const updatedTime = document.createElement('span')
    updatedTime.textContent = `Date: ${todo.updatedAt.slice(0, 10)}`
    todoItem.append(checkBox, todoText, modifyBtn, deleteBtn, updatedTime)
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
    console.log(e.target.parentNode.id)
    deleteTodo(e.target.parentNode.id)
  }
  if (e.target.className === 'modify-btn') {
    // 수정 버튼에 대한 이벤트
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
  const confirmBtn = document.createElement('button')
  textArea.value = value
  confirmBtn.classList.add('confirm-btn')
  confirmBtn.textContent = '확인'
  const cancelBtn = document.createElement('button')
  cancelBtn.classList.add('cancel-btn')
  cancelBtn.textContent = '취소'
  modalContainer.append(modalTitle, textArea, confirmBtn, cancelBtn)
  textArea.addEventListener('input', (e) => {
    value = e.target.value
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
      putTodoTitle({ id, value, done: false })
    }
  })
  contentList.appendChild(modalContainer)
}
