import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Limpa todos os dados salvos no login
    localStorage.clear();
    // Redireciona para o login
    navigate('/login');
  }, [navigate]);

  return (
    <div>Saindo...</div>
  )
}

export default Logout;