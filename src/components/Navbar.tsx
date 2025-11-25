import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/20/solid';

type UserRole = 'admin' | 'user' | 'guest';

interface NavbarProps {
  userRole?: UserRole;
}

function Navbar({ userRole }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Se o userRole não for fornecido, tenta detectar do localStorage
  const role: UserRole = userRole || (() => {
    const isAdmin = localStorage.getItem('isAdmin');
    const token = localStorage.getItem('authToken');
    
    if (token) {
      return isAdmin === 'true' ? 'admin' : 'user';
    }
    return 'guest';
  })();

  const userName = localStorage.getItem('userName');

  // Rotas públicas - disponíveis para todos
  const publicRoutes = [
    { name: 'Início', path: '/' },
    { name: 'Projetos', path: '/projetos' },
    { name: 'Artigos', path: '/artigos' },
    { name: 'Produtos', path: '/produtos' },
    { name: 'Sobre', path: '/sobre' },
    { name: 'FAQ', path: '/faq' },
  ];

  // Rotas de usuário comum - apenas para usuários logados
  const userRoutes = [
    { name: 'Meus Projetos', path: '/user-projects' },
    { name: 'Meus Artigos', path: '/user-articles' },
    { name: 'Meus Produtos', path: '/user-produtos' },
  ];

  // Rotas de administração - apenas para admins
  const adminRoutes = [
    { name: 'Projetos', path: '/admin-projects' },
    { name: 'Artigos', path: '/admin-articles' },
    { name: 'Produtos', path: '/admin-produtos' },
    { name: 'Gestão de Dúvidas', path: '/admin-gestao' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('isAdmin');
    navigate('/');
    window.location.reload();
  };

  // Se for guest (não logado), mostra apenas Header público
  if (role === 'guest') {
    return (
      <header className="bg-primary-color text-light-color shadow-md">
        <nav className="container mx-auto flex items-center justify-between py-4 ml-[10%]">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <NavLink to="/" className="flex items-center">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Logo-upe-site.png" 
                alt="Logo" 
                className="h-10 w-15 object-contain"
              />
              <span className="ml-5 text-2xl font-semibold tracking-wide">
                Observatório de Projetos
              </span>
            </NavLink>
          </div>

          {/* Menu button (mobile) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-light-color focus:outline-none"
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Nav Links */}
          <div className={`md:flex items-center space-x-6 ${isOpen ? 'block' : 'hidden'} md:block`}>
            {publicRoutes.map((route) => (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) =>
                  "text-lg font-medium hover:text-gray-300 transition duration-200 " +
                  (isActive ? "underline" : "")
                }
              >
                {route.name}
              </NavLink>
            ))}
          </div>

          {/* Login */}
          <div className="hidden md:flex items-center">
            <NavLink
              to="/logintest"
              className="flex items-center px-4 py-2 bg-gray-100 text-primary-color rounded-full shadow-lg hover:bg-gray-400 transition duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A5.982 5.982 0 0112 15c1.657 0 3.156.672 4.242 1.758M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Entrar
            </NavLink>
          </div>
        </nav>

        {/* Dropdown Menu (mobile) */}
        {isOpen && (
          <div className="md:hidden bg-primary-color">
            <ul className="space-y-4 px-6 py-4">
              {publicRoutes.map((route) => (
                <li key={route.path}>
                  <NavLink
                    to={route.path}
                    className={({ isActive }) =>
                      "block text-lg font-medium text-light-color hover:text-gray-300 transition duration-200 " +
                      (isActive ? "underline" : "")
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {route.name}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink
                  to="/logintest"
                  className="block text-lg font-medium text-light-color hover:text-gray-300 transition duration-200 flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A5.982 5.982 0 0112 15c1.657 0 3.156.672 4.242 1.758M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Entrar
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </header>
    );
  }

  // Para usuários logados (user ou admin)
  // Admins veem rotas públicas principais + rotas administrativas
  // Usuários veem rotas públicas principais + rotas de usuário
  const mainPublicRoutes = publicRoutes.filter(route => 
    ['Início', 'Projetos', 'Artigos', 'Produtos'].includes(route.name)
  );
  
  const routesToShow = role === 'admin' 
    ? [...mainPublicRoutes, ...adminRoutes]
    : [...mainPublicRoutes, ...userRoutes];

  return (
    <header className="bg-primary-color shadow text-light-color h-[10vh] w-full flex justify-between items-center px-4">
      {/* Logo e botão voltar */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/')}
          className="ml-8 relative flex items-center hover:opacity-80 transition-opacity"
        >
          <ArrowLeftStartOnRectangleIcon className="w-10 h-10" />
        </button>
        <NavLink to="/" className="flex items-center">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Logo-upe-site.png" 
            alt="Logo" 
            className="h-10 w-15 object-contain"
          />
        </NavLink>
      </div>

      {/* Links de navegação centralizados */}
      <div className="flex-1 flex justify-center items-center space-x-8">
        {routesToShow.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) =>
              "text-lg font-medium hover:text-gray-300 transition duration-200 " +
              (isActive ? "underline" : "")
            }
          >
            {route.name}
          </NavLink>
        ))}
      </div>

      {/* Informações do usuário e logout */}
      <div className="text-white text-lg ml-auto flex items-center space-x-4 px-4">
        <span className="font-semibold">
          {userName ? `Olá, ${userName}` : 'Usuário'}
        </span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full transition duration-200 text-sm"
        >
          Sair
        </button>
      </div>
    </header>
  );
}

export default Navbar;
