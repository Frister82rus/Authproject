import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/csrf-token')
        .then(response => {
            localStorage.setItem('csrfToken', response.data.csrfToken);
            axios.defaults.headers.common['X-CSRF-TOKEN'] = response.data.csrfToken;
            console.log(localStorage)
        })
        .catch(error => {
            console.error('Ошибка при получении CSRF токена:', error);
        });
  }, []);
 
  const handleLoginSubmit = (event) => {
      event.preventDefault();
      login(email, password);
  };
  const handleRegisterSubmit = (event) => {
      event.preventDefault();
      register(name, email, password, confirmPassword);
  };
  function login(email, password) {
    axios.post('http://localhost:8000/login', { email, password }, { withCredentials: true })
        .then(response => {
            console.log('Авторизация успешна:', response);
        })
        .catch(error => {
            console.error('Ошибка авторизации:', error);
        });
  }
  function register(name, email, password, confirmPassword) {
    if(password !== confirmPassword) {
        console.error("Пароли не совпадают");
        return;
    }
    axios.post('http://localhost:8000/register', { name, email, password }, { withCredentials: true })
        .then(response => {
            console.log('Регистрация успешна:', response);
        })
        .catch(error => {
            console.log(localStorage)
            console.error('Ошибка регистрации:', error);
        });
  }

  return (
    <div>
      <form onSubmit={handleLoginSubmit}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <button type="submit">Войти</button>
      </form>
      <form onSubmit={handleRegisterSubmit}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required />
          <button type="submit">Регистрация</button>
      </form>
    </div>
  );
}

export default App;