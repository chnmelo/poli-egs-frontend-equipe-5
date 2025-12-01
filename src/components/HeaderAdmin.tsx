// import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/20/solid';
import Nav from 'react-bootstrap/Nav';

function HeaderAdmin() {
  const userName = localStorage.getItem('userName');

  return (
    <header className="bg-primary-color shadow text-light-color h-[10vh] w-full flex justify-between items-center px-4">
      <Nav className="flex flex-1">
        <Nav.Link href="/" className="mr-auto ml-8 relative flex items-center">
          Início
        </Nav.Link>
        <div className="flex-1 flex justify-center space-x-8">
          <Nav.Link href="/admin-projects">Projetos</Nav.Link>
          <Nav.Link href="/admin-articles">Artigos</Nav.Link>
          <Nav.Link href="/admin-produtos">Produtos</Nav.Link>
          <Nav.Link href="/admin-gestao">Gestão de Dúvidas e Sugestões</Nav.Link>


        </div>
      </Nav>
      <div className="text-white text-lg ml-auto flex items-center space-x-2 px-4 py-2 bg-blue-1000 transition duration-300">
        <span className="font-semibold">
          {userName ? `Olá, ${userName}` : 'UNKNOWN'}
        </span>
      </div>
    </header>
  );
}

export default HeaderAdmin;
