import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const http = axios.create()
http.defaults.baseURL = process.env.BASE_URL

export default http
