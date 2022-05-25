const axios = require('axios')
import '../scss/main.scss'

async function createTodo(value) {
  const { data } = await axios({
    url: 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      apikey: 'FcKdtJs202110',
      username: 'KDT2_LeeKyungTaek',
    },
    data: {
      title: value,
    },
  })
  console.log(data)
}

const formEl = document.querySelector('form')
const inputEl = document.querySelector('.form-input')
const todoItem = document.createElement('li')
const todoUlEl = document.createElement('ul')
const containerEl = document.querySelector('.container')
let todos = [
  {
    id: 0,
    text: '',
  },
]
formEl.addEventListener('submit', render)

// function submitTodo(e) {
//   e.preventDefault()
//   // console.log(inputEl.value)
//   const value = inputEl.value
//   createTodo(value)
//   render()
// }

function render(e) {
  e.preventDefault()
  const todo = todos.map((todo) => {
    return todo
  })
  containerEl.innerHTML = `
  <div><ul>
  <li>${inputEl.value}</div>
  </ul></div>
  `
}
render()
