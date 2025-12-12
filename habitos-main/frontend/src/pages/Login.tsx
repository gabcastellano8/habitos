import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'; 
import './Auth.css'; // Importa o CSS
import { api } from "../services/api"; // Importa o serviço de API

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); // Hook para fazer o redirecionamento

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Por favor, preencha e-mail e senha.");
      setLoading(false);
      return;
    }

    try {
      // --- LÓGICA DA API (Contrato de Login) ---
      
      // Passo 1: Tentar fazer o login
      const response = await api.post('/login', { email, senha: password });

      // Passo 2: Salvar token no localStorage
      const token = response.data.token;
      localStorage.setItem('token', token);
      
      // Passo 3: Atualizar a instância da API para usar o token
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Passo 4: Redirecionar para o dashboard
      navigate('/dashboard'); 

    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        setError("Usuário ou senha inválidos.");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Ocorreu um erro ao tentar fazer login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Wrapper para centralizar a página
    <div className="auth-page-wrapper"> 
      <div className="auth-container">
        <h2>Login</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label htmlFor="email">E-mail:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Senha:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="auth-link">
            Não tem uma conta? <Link to="/register">Cadastre-se</Link>
          </p>
        </form>
      </div>
    </div>
  );
}