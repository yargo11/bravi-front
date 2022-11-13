import axios from 'axios'

export const apiUrl = axios.create({
    baseURL: "http://localhost:3333/contatos"
})