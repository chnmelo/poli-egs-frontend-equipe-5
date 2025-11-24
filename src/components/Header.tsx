import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowRightStartOnRectangleIcon, UserCircleIcon } from '@heroicons/react/20/solid';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  
  // A função dentro do useState garante que isso rode apenas na criação do componente, sem delay.
  const [userName, setUserName] = useState<string | null>(() => localStorage.getItem('userName'));
  
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpa os dados de autenticação
    localStorage.clear();
    setUserName(null);
    navigate('/login');
  };

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

        {/* Nav Links Desktop */}
        <div className={`md:flex items-center space-x-6 ${isOpen ? 'block' : 'hidden'} md:block`}>
          {['Início', 'Projetos', 'Artigos','Produtos', 'Sobre', 'FAQ'].map((item, index) => (
            <NavLink
              key={index}
              to={item === 'Início' ? '/' : `/${item.toLowerCase()}`}
              className={({ isActive }) =>
                "text-lg font-medium hover:text-gray-300 transition duration-200 " +
                (isActive ? "underline" : "")
              }
            >
              {item}
            </NavLink>
          ))}
        </div>

        {/* Login / User Info Desktop */}
        <div className="hidden md:flex items-center">
          {userName ? (
            <div className="flex items-center gap-4">
               <div className="flex items-center text-white font-medium">
                  <UserCircleIcon className="h-6 w-6 mr-2" />
                  Olá, {userName}
               </div>
               <button 
                 onClick={handleLogout}
                 className="flex items-center px-4 py-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition duration-200 text-sm"
               >
                 <ArrowRightStartOnRectangleIcon className="h-4 w-4 mr-1" />
                 Sair
               </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center px-4 py-2 bg-gray-100 text-primary-color rounded-full shadow-lg hover:bg-gray-400 transition duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A5.982 5.982 0 0112 15c1.657 0 3.156.672 4.242 1.758M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Entrar
            </NavLink>
          )}
        </div>
      </nav>

      {/* Mobile Menu com Lógica de Login */}
      {isOpen && (
        <div className="md:hidden bg-primary-color">
          <ul className="space-y-4 px-6 py-4">
            {['Início', 'Projetos', 'Artigos','Produtos', 'Sobre', 'FAQ'].map((item, index) => (
              <li key={index}>
                <NavLink
                  to={`/${item.toLowerCase()}`}
                  className={({ isActive }) =>
                    "block text-lg font-medium text-light-color hover:text-gray-300 transition duration-200 " +
                    (isActive ? "underline" : "")
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </NavLink>
              </li>
            ))}
            <li>
              {userName ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left text-lg font-medium text-red-300 hover:text-red-100 transition duration-200"
                >
                  Sair ({userName})
                </button>
              ) : (
                <NavLink
                  to="/login"
                  className="block text-lg font-medium text-light-color hover:text-gray-300 transition duration-200 flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  Entrar
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;