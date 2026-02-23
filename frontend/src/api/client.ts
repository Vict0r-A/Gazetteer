import axios from 'axios'
// Shared Axios variable for all API calls
export const api = axios.create({
  baseURL: '',
  timeout: 15000
})
