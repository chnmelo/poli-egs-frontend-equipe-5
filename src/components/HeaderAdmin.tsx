import { ArrowLeftStartOnRectangleIcon, ArrowRightStartOnRectangleIcon, UserCircleIcon } from '@heroicons/react/20/solid';
import Nav from 'react-bootstrap/Nav';
import { useNavigate, Link } from 'react-router-dom';

function HeaderAdmin() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="bg-primary-color shadow text-light-color h-[10vh] w-full flex justify-between items-center px-4">
      <Nav className="flex flex-1 items-center overflow-hidden">
        <Nav.Link href="/" className="mr-4 relative flex items-center text-light-color hover:text-white transition-colors" title="Ir para o Site Público">
          <ArrowLeftStartOnRectangleIcon className="w-8 h-8"/>
        </Nav.Link>
        
        {/* Links de Navegação */}
        <div className="flex space-x-2 lg:space-x-6 overflow-x-auto no-scrollbar">
          <Nav.Link href="/admin-projects" className="text-light-color hover:text-white font-medium whitespace-nowrap">Projetos</Nav.Link>
          <Nav.Link href="/admin-articles" className="text-light-color hover:text-white font-medium whitespace-nowrap">Artigos</Nav.Link>
          <Nav.Link href="/admin-produtos" className="text-light-color hover:text-white font-medium whitespace-nowrap">Produtos</Nav.Link>
          <Nav.Link href="/admin-gestao" className="text-light-color hover:text-white font-medium whitespace-nowrap" title="Gestão de Dúvidas e Sugestões">
            Gestão de Dúvidas
          </Nav.Link>
        </div>
      </Nav>

      <div className="flex items-center gap-4 ml-4 flex-shrink-0">
        {/* Botão de Edição de Perfil */}
        <Link 
          to="/user-profile" 
          className="flex items-center gap-2 text-white hover:bg-blue-800 px-3 py-2 rounded-lg transition-colors group"
          title="Editar meu perfil"
        >
          <UserCircleIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <span className="text-lg font-semibold hidden md:block max-w-[150px] truncate">
            {userName ? `Olá, ${userName}` : 'Admin'}
          </span>
        </Link>

        {/* Botão de Logout */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-bold shadow-md"
          title="Sair do sistema"
        >
          <span>Sair</span>
          <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

export default HeaderAdmin;