import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'; 
import './Auth.css'; 
import { api } from "../services/api"; 

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); 

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

      const response = await api.post('/login', { email, senha: password });

      const token = response.data.token;
      localStorage.setItem('token', token);
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

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