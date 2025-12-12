import axios from 'axios';

// Pega o token do localStorage, se existir
const token = localStorage.getItem('token');

export const api = axios.create({
  // URL base do seu backend
  baseURL: 'http://localhost:3000/api', 
});

// Adiciona o token em TODAS as requisições
// se ele existir (para as rotas protegidas)
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}