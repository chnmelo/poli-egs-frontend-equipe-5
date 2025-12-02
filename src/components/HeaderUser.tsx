import { ArrowLeftStartOnRectangleIcon, ArrowRightStartOnRectangleIcon, UserCircleIcon } from '@heroicons/react/20/solid';
import Nav from 'react-bootstrap/Nav';
import { useNavigate, Link } from 'react-router-dom'; // Importe Link

function HeaderUser() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="bg-primary-color shadow text-light-color h-[10vh] w-full flex justify-between items-center px-4">     
      <Nav className="flex flex-1 items-center">
        <Nav.Link href="/" className="mr-6 relative flex items-center text-light-color hover:text-white transition-colors" title="Voltar para o Início">
          <ArrowLeftStartOnRectangleIcon className="w-8 h-8"/>
        </Nav.Link>
        
        <div className="flex space-x-6">
          <Nav.Link href="/user-projects" className="text-light-color hover:text-white font-medium">Projetos</Nav.Link>
          <Nav.Link href="/user-articles" className="text-light-color hover:text-white font-medium">Artigos</Nav.Link>
          <Nav.Link href="/user-produtos" className="text-light-color hover:text-white font-medium">Produtos</Nav.Link>
        </div>
      </Nav>

      <div className="flex items-center gap-4">
        {/* Link para o Perfil */}
        <Link 
          to="/user-profile" 
          className="flex items-center gap-2 text-white hover:bg-blue-800 px-3 py-2 rounded-lg transition-colors group"
          title="Editar meu perfil"
        >
          <UserCircleIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <span className="text-lg font-semibold hidden md:block">
            {userName ? `Olá, ${userName}` : 'Usuário'}
          </span>
        </Link>

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

export default HeaderUser;
