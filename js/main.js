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

// CONSTANT
const URL = 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos'
const API_KEY = 'FcKdtJs202204'
const USERNAME = 'KDT2_LeeKyungTaek'

// CREATE
async function createTodo(value) {
  if (!value.title.trim()) return
  const { data } = await axios({
    url: URL,
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      apikey: API_KEY,
      username: USERNAME,
    },
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
    headers: {
      'content-type': 'application/json',
      apikey: API_KEY,
      username: USERNAME,
    },
  })
  console.log(data)
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
    headers: {
      'content-type': 'application/json',
      apikey: API_KEY,
      username: USERNAME,
    },
  })
  fetchTodo()
}
// PUT
async function putTodo(param) {
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

  renderTodo(data)
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

function renderTodo(todos) {
  order = todos.order
  resetRender()
  todos.map((todo) => {
    const todoItem = document.createElement('li')
    todoItem.setAttribute('id', todo.id)
    const todoText = document.createElement('div')
    todoText.textContent = todo.title
    const checkBox = document.createElement('input')
    checkBox.setAttribute('type', 'checkbox')
    let boolean = false
    checkBox.setAttribute('checked', boolean)
    checkBox.checked = false
    checkBox.addEventListener('click', () => {
      todoText.classList.toggle('checked')
      boolean = !boolean
      checkBox.setAttribute('checked', boolean)
      doneTodo({ done: boolean, id: todo.id })
    })
    const modifyBtn = document.createElement('button')
    modifyBtn.setAttribute('class', 'modify-btn')
    modifyBtn.textContent = '수정'
    const deleteBtn = document.createElement('button')
    deleteBtn.setAttribute('class', 'delete-btn')
    deleteBtn.textContent = '삭제'
    todoItem.append(checkBox, todoText, modifyBtn, deleteBtn)
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
    const id = e.target.parentNode.id
    textBoolean = !textBoolean
    console.log(textBoolean, id)
    if (textBoolean) {
      renderModal(id)
    }
  }
})
function renderModal(id) {
  const modalContainer = document.createElement('div')
  modalContainer.classList.add('modal-container')
  modalContainer.textContent = '수정 사항'
  const confirmBtn = document.createElement('button')
  confirmBtn.classList.add('confirm-btn')
  confirmBtn.textContent = '확인'
  const cancelBtn = document.createElement('button')
  cancelBtn.classList.add('cancel-btn')
  cancelBtn.textContent = '취소'
  modalContainer.append(textArea, confirmBtn, cancelBtn)
  console.log('rendered')
  let value = ''
  textArea.addEventListener('input', (e) => {
    value = e.target.value
    // putTodo({ id, value, done: false })
  })
  modalContainer.addEventListener('click', (e) => {
    if (e.target.className === 'cancel-btn') {
    }
    if (e.target.className === 'confirm-btn') {
      putTodo({ id, value, done: false })
      modalContainer.classList.remove('modal-container')
    }
  })
  contentList.appendChild(modalContainer)
}

// deleteBtn.addEventListener('click' (e)=> {
//   console.log(e)
// })

// function onRemoveItem() {
//   const removeBtn = document.querySelector('.btn__remove')
//   console.log(removeBtn)
// }
