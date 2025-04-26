import axios from 'axios'

export const axiosapiinstance = axios.create({
    baseURL: 'http://localhost:5001/api',
    withCredentials: true
})