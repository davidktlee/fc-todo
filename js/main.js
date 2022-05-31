import '../scss/main.scss'
import request from './api'
// SELECTOR
const inputEl = document.querySelector('.form-input')
const contentList = document.querySelector('.content-list')
const addBtn = document.querySelector('.add-btn')
const todoUlEl = document.querySelector('.content-list ul')
const selectInput = document.querySelector('.input')
const selectBtn1 = document.querySelector('.importance-btn1')
const selectBtn2 = document.querySelector('.importance-btn2')
const selectBtn3 = document.querySelector('.importance-btn3')
const selectBtn4 = document.querySelector('.importance-btn4')
const sortItem = document.querySelector('.sort-item')
const deleteAllBtn = document.querySelector('.delete-all')
const doneTodoEl = document.createElement('div')
const spinner = document.querySelector('.spinner-border')

// CREATE VARIABLES
const textArea = document.createElement('input')
let order = 1
let textBoolean = false
let id

// CONSTANT
const URL = 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos'

// FETCH
fetchTodo()

// TODO INPUT
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

// EVENT
// SUBMIT
addBtn.addEventListener('click', submitTodo)

// SELECT IMPORTANCE
selectInput.addEventListener('click', (e) => {
  if (e.target.className === 'importance-btn1') {
    order = e.target.value
    selectBtn1.classList.add('selected')
    selectBtn2.classList.remove('selected')
    selectBtn3.classList.remove('selected')
    selectBtn4.classList.remove('selected')
  }
  if (e.target.className === 'importance-btn2') {
    order = e.target.value
    selectBtn1.classList.remove('selected')
    selectBtn2.classList.add('selected')
    selectBtn3.classList.remove('selected')
    selectBtn4.classList.remove('selected')
  }
  if (e.target.className === 'importance-btn3') {
    order = e.target.value
    selectBtn1.classList.remove('selected')
    selectBtn2.classList.remove('selected')
    selectBtn3.classList.add('selected')
    selectBtn4.classList.remove('selected')
  }
  if (e.target.className === 'importance-btn4') {
    order = e.target.value
    selectBtn1.classList.remove('selected')
    selectBtn2.classList.remove('selected')
    selectBtn3.classList.remove('selected')
    selectBtn4.classList.add('selected')
  }
})

// DELETE ALL BTN
deleteAllBtn.addEventListener('click', () => {
  id.forEach((item) => {
    deleteDoneTodo(item.id)
  })
})

// 이벤트 위임
contentList.addEventListener('click', (e) => {
  //삭제 버튼에 대한 이벤트
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

// CREATE
async function createTodo(value) {
  loadingFunc()
  try {
    if (!value.title.trim()) return
    const { data } = await request({
      method: 'POST',
      data: {
        // 시용자의 인풋 값
        title: value.title,
        order: value.order,
      },
    })
    fetchTodo()
  } catch (error) {
    alert('error')
  } finally {
    endLoading()
  }
}

// READ
async function fetchTodo() {
  loadingFunc()
  try {
    const { data } = await request({
      method: 'GET',
    })
    id = data.filter((item) => {
      return item.done === true
    })
    sortRenderTodo(data)
  } catch (error) {
    alert('error')
  } finally {
    endLoading()
  }
}

// DELETE
async function deleteTodo(id) {
  // todo id를 받아서 해당 id todo만 삭제
  try {
    const { data } = await request({
      url: `${URL}/${id}`,
      method: 'DELETE',
    })
    fetchTodo()
  } catch (error) {
    alert('error')
  } finally {
    endLoading()
  }
}

// DELETE DONE TODO
async function deleteDoneTodo(id) {
  // todo id를 받아서 해당 id todo만 삭제
  try {
    const { data } = await request({
      url: `${URL}/${id}`,
      method: 'DELETE',
    })
    fetchTodo()
  } catch (error) {
    alert('error')
  } finally {
    endLoading()
  }
}

// PUT DONE VALUE
async function putTodoBoolean(boolean, id, value, order) {
  try {
    const { data } = await request({
      url: `${URL}/${id}`,
      method: 'PUT',
      data: {
        title: value,
        order,
        done: boolean,
      },
    })
    fetchTodo()
  } catch (error) {
    alert('error')
  } finally {
    endLoading()
  }
}

// PUT TITLE CHANGE
async function putTodoTitle(param) {
  try {
    const { id, value, done, order } = param
    const { data } = await request({
      url: `${URL}/${id}`,
      method: 'PUT',
      data: {
        title: value,
        done: done,
        order,
      },
    })
    fetchTodo()
  } catch (error) {
    alert('error')
  } finally {
    endLoading()
  }
}

// SORT RENDER TODO
function sortRenderTodo(todos) {
  renderTodo(todos)
  sortItem.addEventListener('change', (e) => {
    if (e.target.value === '1') {
      let sortByFalse
      sortByFalse = todos.filter((todo) => {
        return todo.done === false
      })
      renderTodo(sortByFalse)
    } else if (e.target.value === '2') {
      let sortByTrue
      sortByTrue = todos.filter((todo) => {
        return todo.done === true
      })
      renderTodo(sortByTrue)
    } else {
      renderTodo(todos)
    }
  })
}

// TODO RENDER
function renderTodo(todos) {
  resetRender()
  const doneTodo = todos.filter((todo) => {
    return todo.done === true
  })
  doneTodoEl.classList.add('done-list')
  doneTodoEl.textContent = `${doneTodo.length}개의 완료된 항목`
  deleteAllBtn.after(doneTodoEl)
  todos.map((todo) => {
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
    const hour = parseInt(todo.updatedAt.slice(12, 13)) + 9
    const minutes = parseInt(todo.updatedAt.slice(14, 16))
    updatedTime.textContent = `Date: ${todo.updatedAt.slice(2, 10)} ${hour}:${minutes}`
    todoItem.append(checkBox, todoText, modifyBtn, deleteBtn, renderSelect, updatedTime)
    todoUlEl.appendChild(todoItem)
  })

  contentList.appendChild(todoUlEl)
}

// 삭제나 추가 후 새로고침
function resetRender() {
  todoUlEl.innerHTML = ''
  inputEl.value = ''
  doneTodoEl.textContent = ''
}

// LOADING IMAGE
function loadingFunc() {
  spinner.classList.remove('hide')
}
function endLoading() {
  spinner.classList.add('hide')
}
// RENDER MODAL
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
