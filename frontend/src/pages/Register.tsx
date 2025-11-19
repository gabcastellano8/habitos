import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'; 
import './Auth.css'; 
import { api } from "../services/api"; 

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError(""); 

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);

    // --- LÓGICA CORRETA (FLUXO 'B' - DUAS CHAMADAS) ---
    try {
      // Passo 1: Tentar criar o usuário
      await api.post('/usuarios', { email, senha: password }); 

      // Passo 2: Se criou, fazer o login para pegar o token
      const loginResponse = await api.post('/login', { email, senha: password });

      // Passo 3: Salvar token e redirecionar
      const token = loginResponse.data.token;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      navigate('/dashboard'); 

    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); 
      } else if (err.response?.status === 400) {
        setError("E-mail ou senha inválidos.");
      } else {
        setError("Ocorreu um erro desconhecido. Tente novamente.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Wrapper para centralizar a página
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <h2>Criar Conta</h2>

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
              minLength={6}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
          
          <p className="auth-link">
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}