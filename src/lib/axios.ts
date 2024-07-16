import axios from 'axios'

export const api = axios.create({
    baseURL: 'https://nodedeploy-api-7j2k.onrender.com'
})