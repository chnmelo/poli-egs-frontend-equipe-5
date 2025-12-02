import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import axios from 'axios';

// Páginas
import Projects from './pages/Projects'
import Project from './pages/Project.tsx'
import ProjectsAdmin from './pages/Admin/Projects.tsx'
import ArticlesAdmin from './pages/Admin/Artigos.tsx'
import ProdutosAdmin from './pages/Admin/Produtos.tsx'
import GestaoAdmin from './pages/Admin/Gestao.tsx'
import Articles from './pages/Artigos.tsx'
import Produtos from './pages/Produtos.tsx';
import Sobre from './pages/Sobre.tsx'
import FAQ from './pages/FAQ.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword.tsx';
import Profile from './pages/User/Profile.tsx';

// Páginas do Usuário
import Userprojects from './pages/User/User-projects.tsx';
import Userarticles from './pages/User/User-articles.tsx';
import Userprodutos from './pages/User/User-produtos.tsx';

// Configuração Global do Axios
const envURL = import.meta.env.VITE_url_backend || 'https://api.observatorio.poli.br';
axios.defaults.baseURL = envURL; 
axios.defaults.headers.common['Content-Type'] = 'application/json';

// 1. Interceptor de REQUISIÇÃO (Injeta o token se existir)
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Interceptor de RESPOSTA
axios.interceptors.response.use(
  (response) => {
    // Se a resposta for sucessos, apenas retorna os dados
    return response;
  },
  (error) => {
    // Verifica se o erro é de autenticação (401 - Não autorizado ou 403 - Proibido)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      // Se não estivermos já na página de login, fazemos o logout forçado
      if (!window.location.pathname.includes('/login')) {
        // Limpa TODOS os dados de sessão
        localStorage.removeItem('authToken');
        localStorage.removeItem('email');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('isAdmin');
        
        alert('Sua sessão expirou. Por favor, faça login novamente.');
        
        // Redireciona para o login (usando window.location pois estamos fora de um componente React)
        window.location.href = '/login';
      }
    }
    // Repassa o erro para o componente caso ele queira tratar algo específico
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route path='/' element={<App />} />
          <Route path='/projetos' element={<Projects />} />
          <Route path='/projetos/:slug' element={<Project />} />
          <Route path='/artigos' element={<Articles />} />
          <Route path='/produtos' element={<Produtos/>} />
          <Route path='/login' element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/esqueci-a-senha' element={<ForgotPassword />} />
          <Route path='/sobre' element={<Sobre />} />
          <Route path='/faq' element={<FAQ />} />

          {/* Rotas de Usuário Logado */}
          <Route path='/user-projects' element={<Userprojects />} />
          <Route path='/user-articles' element={<Userarticles />} />
          <Route path='/user-produtos' element={<Userprodutos />} />

          {/* Rotas de Admin */}
          <Route path='/admin-projects' element={<ProjectsAdmin />} />
          <Route path='/admin-articles' element={<ArticlesAdmin />} />
          <Route path='/admin-produtos' element={<ProdutosAdmin/>} />
          <Route path='/admin-gestao' element={<GestaoAdmin/>} />
          <Route path='/user-profile' element={<Profile />} />
        </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)