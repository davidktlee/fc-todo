const axios = require('axios')
// CONSTANT
const URL = 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos'
const API_KEY = 'FcKdtJs202204'
const USERNAME = 'KDT2_LeeKyungTaek'
const headers = {
  'content-type': 'application/json',
  apikey: API_KEY,
  username: USERNAME,
}

async function request({ url = URL, method = '', data = {} }) {
  const res = await axios({
    url,
    method,
    headers,
    data,
  })
  return res
}

export default request
